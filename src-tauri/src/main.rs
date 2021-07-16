#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::sync::{Arc, Mutex};
  use tauri::{Manager, State, Window};

  // wrappers around each Window
  // we use a dedicated type because Tauri can only manage a single instance of a given type
  struct MainWindow(Arc<Mutex<Window>>);

  #[tauri::command]
  fn show_main_window(
    _: Window, // force inference of P
    main: State<MainWindow>,
  ) {
    // Show main window
    main.0.lock().unwrap().show().unwrap();
  }

fn main() {
  tauri::Builder::default()
  .setup(|app| {
	// set the main windows to be globally available with the tauri state API
	app.manage(MainWindow(Arc::new(Mutex::new(
	  app.get_window("main").unwrap(),
	))));
	Ok(())
  })
  .invoke_handler(tauri::generate_handler![show_main_window])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}
