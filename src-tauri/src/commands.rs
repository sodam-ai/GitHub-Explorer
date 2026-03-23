use crate::db::Database;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchHistoryEntry {
    pub id: String,
    pub query: String,
    pub result_count: i64,
    pub filters: Option<String>,
    pub searched_at: String,
}

// --- Search History ---

#[tauri::command]
pub fn save_search_history(db: State<Database>, entry: SearchHistoryEntry) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT OR REPLACE INTO search_history (id, query, result_count, filters, searched_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        rusqlite::params![entry.id, entry.query, entry.result_count, entry.filters, entry.searched_at],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_search_history(db: State<Database>, limit: Option<i64>) -> Result<Vec<SearchHistoryEntry>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(50);
    let mut stmt = conn
        .prepare("SELECT id, query, result_count, filters, searched_at FROM search_history ORDER BY searched_at DESC LIMIT ?1")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(rusqlite::params![limit], |row| {
            Ok(SearchHistoryEntry {
                id: row.get(0)?,
                query: row.get(1)?,
                result_count: row.get(2)?,
                filters: row.get(3)?,
                searched_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;
    let mut entries = Vec::new();
    for row in rows {
        entries.push(row.map_err(|e| e.to_string())?);
    }
    Ok(entries)
}

#[tauri::command]
pub fn clear_search_history(db: State<Database>) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM search_history", [])
        .map_err(|e| e.to_string())?;
    Ok(())
}

// --- Settings ---

#[tauri::command]
pub fn save_setting(db: State<Database>, key: String, value: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT OR REPLACE INTO app_settings (key, value) VALUES (?1, ?2)",
        rusqlite::params![key, value],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_setting(db: State<Database>, key: String) -> Result<Option<String>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let result = conn.query_row(
        "SELECT value FROM app_settings WHERE key = ?1",
        rusqlite::params![key],
        |row| row.get(0),
    );
    match result {
        Ok(val) => Ok(Some(val)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn get_all_settings(db: State<Database>) -> Result<Vec<(String, String)>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT key, value FROM app_settings")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| Ok((row.get(0)?, row.get(1)?)))
        .map_err(|e| e.to_string())?;
    let mut settings = Vec::new();
    for row in rows {
        settings.push(row.map_err(|e| e.to_string())?);
    }
    Ok(settings)
}

// --- Collections ---

#[derive(Debug, Serialize, Deserialize)]
pub struct CollectionEntry {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CollectionItemEntry {
    pub id: String,
    pub collection_id: String,
    pub repository_id: String,
    pub memo: Option<String>,
    pub added_at: String,
}

#[tauri::command]
pub fn create_collection(db: State<Database>, entry: CollectionEntry) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO collection (id, name, description, color, icon, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![entry.id, entry.name, entry.description, entry.color.unwrap_or_else(|| "#3b82f6".to_string()), entry.icon.unwrap_or_else(|| "folder".to_string()), entry.created_at],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_collections(db: State<Database>) -> Result<Vec<CollectionEntry>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name, description, color, icon, created_at FROM collection ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(CollectionEntry {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                color: row.get(3)?,
                icon: row.get(4)?,
                created_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;
    let mut entries = Vec::new();
    for row in rows {
        entries.push(row.map_err(|e| e.to_string())?);
    }
    Ok(entries)
}

#[tauri::command]
pub fn delete_collection(db: State<Database>, id: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM collection_item WHERE collection_id = ?1", rusqlite::params![id])
        .map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM collection WHERE id = ?1", rusqlite::params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn add_to_collection(db: State<Database>, item: CollectionItemEntry) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT OR REPLACE INTO collection_item (id, collection_id, repository_id, memo, added_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        rusqlite::params![item.id, item.collection_id, item.repository_id, item.memo, item.added_at],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn remove_from_collection(db: State<Database>, id: String) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM collection_item WHERE id = ?1", rusqlite::params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_collection_items(db: State<Database>, collection_id: String) -> Result<Vec<CollectionItemEntry>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, collection_id, repository_id, memo, added_at FROM collection_item WHERE collection_id = ?1 ORDER BY added_at DESC")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(rusqlite::params![collection_id], |row| {
            Ok(CollectionItemEntry {
                id: row.get(0)?,
                collection_id: row.get(1)?,
                repository_id: row.get(2)?,
                memo: row.get(3)?,
                added_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;
    let mut entries = Vec::new();
    for row in rows {
        entries.push(row.map_err(|e| e.to_string())?);
    }
    Ok(entries)
}

// --- Conversations ---

#[derive(Debug, Serialize, Deserialize)]
pub struct ConversationEntry {
    pub id: String,
    pub title: String,
    pub repository_id: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MessageEntry {
    pub id: String,
    pub conversation_id: String,
    pub role: String,
    pub content: String,
    pub code_refs: Option<String>,
    pub created_at: String,
}

#[tauri::command]
pub fn create_conversation(db: State<Database>, entry: ConversationEntry) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO conversation (id, title, repository_id, created_at) VALUES (?1, ?2, ?3, ?4)",
        rusqlite::params![entry.id, entry.title, entry.repository_id, entry.created_at],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_conversations(db: State<Database>, limit: Option<i64>) -> Result<Vec<ConversationEntry>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(50);
    let mut stmt = conn
        .prepare("SELECT id, title, repository_id, created_at FROM conversation ORDER BY created_at DESC LIMIT ?1")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(rusqlite::params![limit], |row| {
            Ok(ConversationEntry {
                id: row.get(0)?,
                title: row.get(1)?,
                repository_id: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?;
    let mut entries = Vec::new();
    for row in rows {
        entries.push(row.map_err(|e| e.to_string())?);
    }
    Ok(entries)
}

#[tauri::command]
pub fn save_message(db: State<Database>, msg: MessageEntry) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO message (id, conversation_id, role, content, code_refs, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![msg.id, msg.conversation_id, msg.role, msg.content, msg.code_refs, msg.created_at],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_messages(db: State<Database>, conversation_id: String) -> Result<Vec<MessageEntry>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, conversation_id, role, content, code_refs, created_at FROM message WHERE conversation_id = ?1 ORDER BY created_at ASC")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(rusqlite::params![conversation_id], |row| {
            Ok(MessageEntry {
                id: row.get(0)?,
                conversation_id: row.get(1)?,
                role: row.get(2)?,
                content: row.get(3)?,
                code_refs: row.get(4)?,
                created_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;
    let mut entries = Vec::new();
    for row in rows {
        entries.push(row.map_err(|e| e.to_string())?);
    }
    Ok(entries)
}
