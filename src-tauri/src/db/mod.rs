use rusqlite::{Connection, Result};
use std::path::PathBuf;
use std::sync::Mutex;

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
        Ok(db)
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
