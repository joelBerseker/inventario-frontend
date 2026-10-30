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

## Dónde están la aplicación, la base de datos y los recursos

- Aplicación recién compilada: `~/Inventario/inventario-frontend/src-tauri/target/release/bundle/macos/Elegant Lady Inventario.app`
- Instalador, si se generó: `~/Inventario/inventario-frontend/src-tauri/target/release/bundle/dmg/`
- Aplicación instalada después de arrastrarla desde el DMG: `/Applications/Elegant Lady Inventario.app`
- Base de datos utilizada por la aplicación: `~/Library/Application Support/Elegant Lady/db.sqlite3`
- Imágenes y archivos cargados: `~/Library/Application Support/Elegant Lady/media/`
- Recursos internos de la aplicación instalada: `/Applications/Elegant Lady Inventario.app/Contents/Resources/`

La carpeta `Library` del usuario suele estar oculta. Para abrir directamente los datos desde Finder, presiona `Cmd + Shift + G`, pega esta ruta y pulsa Enter:

```text
~/Library/Application Support/Elegant Lady
```

Para ver los recursos internos de la aplicación, haz clic derecho sobre `Elegant Lady Inventario.app`, selecciona **Mostrar contenido del paquete** y abre `Contents/Resources`. No guardes la base de datos dentro de la `.app`: se perdería al reemplazar o actualizar la aplicación.

## Reemplazar la base de datos por una que ya tiene datos

1. Cierra completamente Elegant Lady con `Cmd + Q`.
2. Abre `~/Library/Application Support/Elegant Lady` desde Finder.
3. Renombra la base actual `db.sqlite3` a `db.sqlite3.backup` para conservar una copia recuperable.
4. Copia la base con datos dentro de esa carpeta y asegúrate de que se llame exactamente `db.sqlite3`.
5. Si esa base contiene rutas de fotos o productos, copia también su carpeta `media` y combina su contenido con `~/Library/Application Support/Elegant Lady/media/`.
6. Desde Terminal, aplica cualquier migración pendiente:

```bash
cd ~/Inventario/inventario-backend
.venv-macos/bin/python manage.py migrate --noinput --settings=inventory.settings_desktop
```

7. Abre nuevamente la aplicación e inicia sesión con un administrador existente en la base importada.

Una base SQLite creada en Windows se puede utilizar en macOS. Debes copiar también `media` cuando los registros apuntan a imágenes o archivos guardados fuera de la base.

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
- Si aparece `failed to run bundle_dmg.sh`, la `.app` normalmente ya quedó creada en `src-tauri/target/release/bundle/macos/`. El script intenta el DMG sin automatizar Finder para evitar ese bloqueo. Para reintentarlo manualmente ejecuta `CI=true npm run tauri -- bundle --config src-tauri/tauri.macos.conf.json --bundles dmg` desde `inventario-frontend`.

Los recursos de marca en `public/elegant-lady-icon.png`, `public/elegant-lady-logo.png` y `public/elegant-lady-wordmark.png` se recrearon con la herramienta de imágenes integrada a partir de los tres logotipos adjuntos. Las indicaciones fueron conservar fielmente la silueta, la tipografía, las proporciones, el blanco y el fondo borgoña de cada referencia. La paleta principal usa `#9f0022`, `#650019` y `#fcf8f6`.
