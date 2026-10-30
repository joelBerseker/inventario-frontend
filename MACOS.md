# Elegant Lady · compilación para macOS

El frontend y el backend deben conservarse como carpetas hermanas:

```
Inventario Final/
├── inventario-frontend/
└── inventario-backend/
```

Antes de empezar, actualiza **ambos** repositorios con los cambios de macOS. Comprueba que existen `inventario-frontend/build-macos.sh` e `inventario-backend/requirements-macos.txt`.

Instala una vez las herramientas de línea de comandos de Xcode (`xcode-select --install`), Node.js, Rust/Cargo y Python 3.11. Después, desde `inventario-frontend`, ejecuta **un solo comando**:

```bash
bash build-macos.sh
```

El script instala dependencias, prepara la base de datos local, empaqueta Django con PyInstaller, genera iconos y compila Tauri. Produce `Elegant Lady Inventario.app` en `src-tauri/target/release/bundle/macos/` y un instalador `.dmg` en `src-tauri/target/release/bundle/dmg/`. Debes ejecutar el comando en el propio Mac.

La base de datos y las imágenes de productos se guardan en `~/Library/Application Support/Elegant Lady/`. El paquete no incorpora datos ni contraseñas. Si ya tienes una base de datos, copia `db.sqlite3` a esa carpeta antes de compilar. En una instalación nueva, al terminar la compilación el script pide el nombre, usuario y contraseña del primer administrador. Anota esas credenciales; luego podrás crear usuarios desde el módulo Usuarios.

Si necesitas crear otro administrador manualmente, primero aplica las migraciones y luego ejecuta:

```bash
cd ../inventario-backend
.venv-macos/bin/python manage.py migrate --noinput --settings=inventory.settings_desktop
.venv-macos/bin/python manage.py createsuperuser --settings=inventory.settings_desktop
```

El `.dmg` generado localmente no está firmado ni notarizado. Para distribuirlo fuera de tu Mac se necesita una identidad Apple Developer y notarización.

Los recursos de marca en `public/elegant-lady-icon.png`, `public/elegant-lady-logo.png` y `public/elegant-lady-wordmark.png` se recrearon con la herramienta de imágenes integrada a partir de los tres logotipos adjuntos. Las indicaciones fueron conservar fielmente la silueta, la tipografía, las proporciones, el blanco y el fondo borgoña de cada referencia. La paleta principal usa `#9f0022`, `#650019` y `#fcf8f6`.
