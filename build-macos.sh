#!/usr/bin/env bash
set -euo pipefail

FRONTEND_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(cd "$FRONTEND_DIR/../inventario-backend" && pwd)"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Este comando debe ejecutarse en macOS." >&2
  exit 1
fi
for command in node npm cargo rustc python3.11; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Falta $command. Instala Node.js, Rust y Python 3.11 antes de compilar." >&2
    exit 1
  fi
done
if ! xcode-select -p >/dev/null 2>&1; then
  echo "Instala las herramientas de Xcode con: xcode-select --install" >&2
  exit 1
fi

cd "$BACKEND_DIR"
python3.11 -m venv .venv-macos
"$BACKEND_DIR/.venv-macos/bin/python" -m pip install --upgrade pip
"$BACKEND_DIR/.venv-macos/bin/python" -m pip install -r requirements-macos.txt
"$BACKEND_DIR/.venv-macos/bin/python" manage.py collectstatic --noinput --settings=inventory.settings_desktop
"$BACKEND_DIR/.venv-macos/bin/python" -m PyInstaller --noconfirm --clean inventory.spec

cd "$FRONTEND_DIR"
npm ci
mkdir -p src-tauri/binaries
rm -rf src-tauri/binaries/inventory_backend
cp -R "$BACKEND_DIR/dist/inventory_backend" src-tauri/binaries/inventory_backend
npm run tauri -- icon public/elegant-lady-icon.png --output src-tauri/icons
npm run tauri -- build --config src-tauri/tauri.macos.conf.json

echo "Aplicación: $FRONTEND_DIR/src-tauri/target/release/bundle/macos"
echo "Instalador DMG: $FRONTEND_DIR/src-tauri/target/release/bundle/dmg"
