mod commands;
mod db;

use db::Database;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // SQLite DB 초기화
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("failed to get app data dir");
            let database =
                Database::new(app_data_dir).expect("failed to initialize database");
            app.manage(database);

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::save_search_history,
            commands::get_search_history,
            commands::clear_search_history,
            commands::save_setting,
            commands::get_setting,
            commands::get_all_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
