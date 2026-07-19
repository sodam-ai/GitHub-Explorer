use rusqlite::{Connection, Result};
use std::path::PathBuf;
use std::sync::Mutex;

pub const KEYRING_SERVICE: &str = "github-ai-explorer";

/// 과거 버전에서 app_settings 테이블에 평문 저장되던 시크릿 키 목록.
/// 신규 설치에는 해당 없음 — 기존 사용자의 값을 키체인으로 이관하기 위한 목적.
const LEGACY_PLAINTEXT_SECRET_KEYS: [&str; 5] = [
    "github_token",
    "openai_api_key",
    "anthropic_api_key",
    "gemini_api_key",
    "groq_api_key",
];

pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(app_data_dir: PathBuf) -> Result<Self> {
        std::fs::create_dir_all(&app_data_dir).ok();
        let db_path = app_data_dir.join("github-ai-explorer.db");
        let conn = Connection::open(db_path)?;
        let db = Database {
            conn: Mutex::new(conn),
        };
        db.init_tables()?;
        db.migrate_legacy_plaintext_secrets();
        Ok(db)
    }

    /// app_settings에 남아있는 평문 API 키/토큰을 OS 키체인으로 1회성 이관하고
    /// 평문 행은 삭제한다. 이관 실패(키체인 접근 불가 등)해도 앱 초기화는 막지 않음 —
    /// 실패 시 값은 app_settings에 그대로 남아 다음 실행에서 재시도된다.
    fn migrate_legacy_plaintext_secrets(&self) {
        let conn = self.conn.lock().unwrap();
        for key in LEGACY_PLAINTEXT_SECRET_KEYS {
            let existing: rusqlite::Result<String> = conn.query_row(
                "SELECT value FROM app_settings WHERE key = ?1",
                rusqlite::params![key],
                |row| row.get(0),
            );
            let Ok(value) = existing else { continue };
            if value.is_empty() {
                let _ = conn.execute("DELETE FROM app_settings WHERE key = ?1", rusqlite::params![key]);
                continue;
            }
            match keyring::Entry::new(KEYRING_SERVICE, key).and_then(|e| e.set_password(&value)) {
                Ok(()) => {
                    let _ = conn.execute("DELETE FROM app_settings WHERE key = ?1", rusqlite::params![key]);
                    log::info!("secret '{}' migrated from plaintext DB to OS keychain", key);
                }
                Err(e) => {
                    log::warn!("failed to migrate secret '{}' to keychain, will retry next launch: {}", key, e);
                }
            }
        }
    }

    fn init_tables(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS search_history (
                id TEXT PRIMARY KEY,
                query TEXT NOT NULL,
                result_count INTEGER NOT NULL DEFAULT 0,
                filters TEXT,
                searched_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS ai_provider (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('cloud', 'local')),
                model TEXT NOT NULL,
                endpoint TEXT NOT NULL,
                api_key TEXT,
                is_default INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS repository_cache (
                id TEXT PRIMARY KEY,
                full_name TEXT NOT NULL,
                description TEXT,
                stars INTEGER NOT NULL DEFAULT 0,
                language TEXT,
                topics TEXT,
                url TEXT NOT NULL,
                readme_snippet TEXT,
                owner_avatar TEXT,
                last_synced TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS app_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS collection (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                color TEXT DEFAULT '#3b82f6',
                icon TEXT DEFAULT 'folder',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS collection_item (
                id TEXT PRIMARY KEY,
                collection_id TEXT NOT NULL,
                repository_id TEXT NOT NULL,
                memo TEXT,
                added_at TEXT NOT NULL,
                FOREIGN KEY (collection_id) REFERENCES collection(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS smart_folder (
                id TEXT PRIMARY KEY,
                collection_id TEXT NOT NULL,
                rules TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                FOREIGN KEY (collection_id) REFERENCES collection(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS conversation (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                repository_id TEXT,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS message (
                id TEXT PRIMARY KEY,
                conversation_id TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                code_refs TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS trending_snapshot (
                id TEXT PRIMARY KEY,
                category TEXT NOT NULL,
                date TEXT NOT NULL,
                repositories TEXT NOT NULL,
                created_at TEXT NOT NULL,
                UNIQUE(category, date)
            );
            ",
        )?;

        // collection_item에 저장 시점 스냅샷 메타 컬럼 점진 추가 (idempotent)
        Self::add_column_if_missing(&conn, "collection_item", "full_name", "TEXT")?;
        Self::add_column_if_missing(&conn, "collection_item", "description", "TEXT")?;
        Self::add_column_if_missing(&conn, "collection_item", "stars", "INTEGER")?;
        Self::add_column_if_missing(&conn, "collection_item", "language", "TEXT")?;
        Self::add_column_if_missing(&conn, "collection_item", "owner_avatar", "TEXT")?;
        Self::add_column_if_missing(&conn, "collection_item", "url", "TEXT")?;
        Self::add_column_if_missing(&conn, "collection_item", "topics", "TEXT")?;

        Ok(())
    }

    fn add_column_if_missing(
        conn: &Connection,
        table: &str,
        column: &str,
        col_type: &str,
    ) -> Result<()> {
        let mut stmt = conn.prepare(&format!("PRAGMA table_info({})", table))?;
        let exists = stmt
            .query_map([], |row| {
                let name: String = row.get(1)?;
                Ok(name)
            })?
            .filter_map(|r| r.ok())
            .any(|name| name == column);

        if !exists {
            conn.execute(
                &format!("ALTER TABLE {} ADD COLUMN {} {}", table, column, col_type),
                [],
            )?;
        }
        Ok(())
    }
}
