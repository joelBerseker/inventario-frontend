use tauri::Manager;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

struct BackendChild(Mutex<Child>);

#[tauri::command]
fn print_pdf_url(url: String) -> Result<(), String> {
    if !url.starts_with("http://127.0.0.1:8001/") && !url.starts_with("http://localhost:8001/") {
        return Err("Solo se permite imprimir PDFs del backend local.".to_string());
    }

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| error.to_string())?
        .as_millis();
    let pdf_path = std::env::temp_dir().join(format!("nikabi_ticket_{}.pdf", now));
    let pdf_path_text = pdf_path
        .to_str()
        .ok_or_else(|| "No se pudo preparar el archivo temporal.".to_string())?
        .to_string();

    #[cfg(target_os = "macos")]
    {
        let download = Command::new("curl")
            .args(["--fail", "--silent", "--show-error", "--output"])
            .arg(&pdf_path_text)
            .arg(&url)
            .status()
            .map_err(|error| format!("No se pudo descargar el PDF: {}", error))?;
        if !download.success() { return Err("No se pudo descargar el PDF.".to_string()); }
        let print = Command::new("lpr")
            .arg(&pdf_path_text)
            .status()
            .map_err(|error| format!("No se pudo imprimir el PDF: {}", error))?;
        return if print.success() { Ok(()) } else { Err("La impresora rechazó el PDF.".to_string()) };
    }

    #[cfg(target_os = "windows")]
    {
    let script = r#"
param([string]$Url, [string]$PdfPath)
$ErrorActionPreference = 'Stop'
Invoke-WebRequest -Uri $Url -OutFile $PdfPath
Start-Process -FilePath $PdfPath -Verb Print -WindowStyle Hidden
"#;

    let status = Command::new("powershell")
        .args([
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            script,
            "-Url",
            &url,
            "-PdfPath",
            &pdf_path_text,
        ])
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .map_err(|error| format!("No se pudo iniciar la impresion: {}", error))?;

    if status.success() {
        Ok(())
    } else {
        Err("Windows no pudo enviar el PDF a la impresora predeterminada.".to_string())
    }
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    Err("Impresión no disponible en este sistema.".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![print_pdf_url])
        .setup(|app| {
            let resource_dir = app
                .path()
                .resource_dir()
                .expect("No se pudo obtener resource_dir");

            let backend_name = if cfg!(target_os = "windows") { "inventory_backend.exe" } else { "inventory_backend" };
            let backend_path = resource_dir
                .join("binaries")
                .join("inventory_backend")
                .join(backend_name);

            let backend = Command::new(backend_path)
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
                .map_err(|error| format!("No se pudo iniciar el backend: {}", error))?;
            app.manage(BackendChild(Mutex::new(backend)));

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app, event| {
            if let tauri::RunEvent::Exit = event {
                if let Some(backend) = app.try_state::<BackendChild>() {
                    if let Ok(mut child) = backend.0.lock() {
                        let _ = child.kill();
                        let _ = child.wait();
                    }
                }
            }
        });
}
