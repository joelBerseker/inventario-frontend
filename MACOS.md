# Elegant Lady · compilación para macOS

El frontend y el backend deben conservarse como carpetas hermanas:

```
Inventario Final/
├── inventario-frontend/
└── inventario-backend/
```

Instala una vez las herramientas de línea de comandos de Xcode (`xcode-select --install`), Node.js, Rust/Cargo y Python 3.11. Después, desde `inventario-frontend`, ejecuta **un solo comando**:

```bash
bash build-macos.sh
```

El script instala dependencias, empaqueta Django con PyInstaller, genera iconos y compila Tauri. Produce `Elegant Lady Inventario.app` en `src-tauri/target/release/bundle/macos/` y un instalador `.dmg` en `src-tauri/target/release/bundle/dmg/`. Debes ejecutar el comando en el propio Mac.

La base de datos y las imágenes de productos se guardan en `~/Library/Application Support/Elegant Lady/`. El paquete no incorpora datos ni usuarios. Si ya tienes una base de datos, copia `db.sqlite3` a esa carpeta antes de abrir la aplicación. Si empiezas desde cero, tras compilar crea el primer administrador con:

```bash
cd ../inventario-backend
.venv-macos/bin/python manage.py createsuperuser --settings=inventory.settings_desktop
```

El `.dmg` generado localmente no está firmado ni notarizado. Para distribuirlo fuera de tu Mac se necesita una identidad Apple Developer y notarización.

Los recursos de marca en `public/elegant-lady-icon.png`, `public/elegant-lady-logo.png` y `public/elegant-lady-wordmark.png` se recrearon con la herramienta de imágenes integrada a partir de los tres logotipos adjuntos. Las indicaciones fueron conservar fielmente la silueta, la tipografía, las proporciones, el blanco y el fondo borgoña de cada referencia. La paleta principal usa `#9f0022`, `#650019` y `#fcf8f6`.
