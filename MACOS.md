# Elegant Lady · compilación para macOS

El frontend y el backend deben conservarse como carpetas hermanas:

```
Inventario Final/
├── inventario-frontend/
└── inventario-backend/
```

Antes de empezar, actualiza **ambos** repositorios con los cambios de macOS. Comprueba que existen `inventario-frontend/build-macos.sh` e `inventario-backend/requirements-macos.txt`.

## Instalación en un Mac nuevo

No necesitas instalar Node.js, Rust ni Python manualmente. Desde `inventario-frontend`, ejecuta:

```bash
bash build-macos.sh
```

En un Mac completamente nuevo, la primera ejecución abre el instalador oficial de **Xcode Command Line Tools**. Completa esa ventana y vuelve a ejecutar el mismo comando:

```bash
bash build-macos.sh
```

La siguiente ejecución instala automáticamente **Homebrew**, **Node.js 22 LTS con npm**, **Python 3.11** y **Rust estable con Cargo** cuando hagan falta. Homebrew puede solicitar la contraseña del usuario administrador del Mac. Después continúa con las dependencias del proyecto, prepara la base de datos local, empaqueta Django con PyInstaller, genera los iconos y compila Tauri.

Puedes comprobar las herramientas instaladas con:

```bash
node --version
npm --version
python3.11 --version
rustc --version
cargo --version
```

El resultado será `Elegant Lady Inventario.app` en `src-tauri/target/release/bundle/macos/` y un instalador `.dmg` en `src-tauri/target/release/bundle/dmg/`. La compilación debe ejecutarse en el propio Mac.

La base de datos y las imágenes de productos se guardan en `~/Library/Application Support/Elegant Lady/`. El paquete no incorpora datos ni contraseñas. Si ya tienes una base de datos, copia `db.sqlite3` a esa carpeta antes de compilar. En una instalación nueva, al terminar la compilación el script pide el nombre, usuario y contraseña del primer administrador. Anota esas credenciales; luego podrás crear usuarios desde el módulo Usuarios.

Si necesitas crear otro administrador manualmente, primero aplica las migraciones y luego ejecuta:

```bash
cd ../inventario-backend
.venv-macos/bin/python manage.py migrate --noinput --settings=inventory.settings_desktop
.venv-macos/bin/python manage.py createsuperuser --settings=inventory.settings_desktop
```

El `.dmg` generado localmente no está firmado ni notarizado. Para distribuirlo fuera de tu Mac se necesita una identidad Apple Developer y notarización.

## Problemas frecuentes

- Si el script indica que termines Xcode Command Line Tools, espera a que finalice la ventana de instalación y ejecuta nuevamente `bash build-macos.sh`.
- Si una herramienta recién instalada no aparece, cierra Terminal, abre una nueva ventana, vuelve a `inventario-frontend` y ejecuta el script otra vez.
- Si Homebrew solicita una contraseña, usa la contraseña de un usuario administrador del Mac. Mientras escribes no se muestran caracteres; es el comportamiento normal de Terminal.
- No ejecutes el script con `sudo`. El propio instalador pedirá autorización únicamente cuando sea necesaria.
- Si una compilación anterior terminó con `No module named 'pkg_resources'`, actualiza ambos repositorios y vuelve a ejecutar `bash build-macos.sh`. El script instalará la versión compatible de `setuptools` dentro de `.venv-macos`.

Los recursos de marca en `public/elegant-lady-icon.png`, `public/elegant-lady-logo.png` y `public/elegant-lady-wordmark.png` se recrearon con la herramienta de imágenes integrada a partir de los tres logotipos adjuntos. Las indicaciones fueron conservar fielmente la silueta, la tipografía, las proporciones, el blanco y el fondo borgoña de cada referencia. La paleta principal usa `#9f0022`, `#650019` y `#fcf8f6`.
