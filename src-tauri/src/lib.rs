mod commands;
mod db;

use db::Database;
use tauri::Manager;
use tauri::menu::{MenuBuilder, MenuItemBuilder};
use tauri::tray::TrayIconBuilder;

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

            // 시스템 트레이
            let show = MenuItemBuilder::with_id("show", "열기").build(app)?;
            let quit = MenuItemBuilder::with_id("quit", "종료").build(app)?;
            let menu = MenuBuilder::new(app)
                .item(&show)
                .separator()
                .item(&quit)
                .build()?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("GitHub AI Explorer")
                .menu(&menu)
                .on_menu_event(move |app, event| {
                    match event.id().as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::DoubleClick { .. } = event {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::save_secret,
            commands::get_secret,
            commands::delete_secret,
            commands::save_search_history,
            commands::get_search_history,
            commands::clear_search_history,
            commands::save_setting,
            commands::get_setting,
            commands::get_all_settings,
            commands::create_collection,
            commands::get_collections,
            commands::delete_collection,
            commands::add_to_collection,
            commands::remove_from_collection,
            commands::get_collection_items,
            commands::create_conversation,
            commands::get_conversations,
            commands::save_message,
            commands::get_messages,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
