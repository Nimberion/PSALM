#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use calamine::{open_workbook_auto, Reader};
use std::sync::{Arc, Mutex};
use tauri::{Event, Manager, State, Window};
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

#[tauri::command]
fn read_excel_file(path: String) -> String {
  let mut excel = open_workbook_auto(path).unwrap();

  if let Some(Ok(range)) = excel.worksheet_range("Umfrage") {
    let mut result: std::vec::Vec<Vec<String>> = Vec::new();
    for row in range.rows() {
      let mut json_row: std::vec::Vec<String> = Vec::new();

      for cell in row {
        if cell.is_empty() {
          let value = "";
          json_row.push(format!("{}", value));
        } else if cell.is_string() {
          let value = cell.get_string().unwrap();
          json_row.push(format!("{}", value));
        } else if cell.is_int() {
          let value = cell.get_int();
          json_row.push(serde_json::to_string(&value).unwrap());
        } else if cell.is_float() {
          let value = cell.get_float();
          json_row.push(serde_json::to_string(&value).unwrap());
        } else {
          println!("Unsupported datatype");
        }
      }

      result.push(json_row);
    }
    let json_result: String = serde_json::to_string(&result).unwrap();

    return json_result.into();
  } else {
    return "error".into();
  }
}

fn main() {
  let app = tauri::Builder::default()
    .setup(|app| {
      // set the main windows to be globally available with the tauri state API
      app.manage(MainWindow(Arc::new(Mutex::new(
        app.get_window("main").unwrap(),
      ))));
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![show_main_window, read_excel_file])
    .build(tauri::generate_context!())
    .expect("failed to run app");

  app.run(|app_handle, e| {
    if let Event::CloseRequested { label, api, .. } = e {
      api.prevent_close();
      let window = app_handle.get_window(&label).unwrap();
      window.emit("close-requested", ()).unwrap();
    }
  })
}
