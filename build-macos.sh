#!/usr/bin/env bash
set -euo pipefail

FRONTEND_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_CANDIDATE="$FRONTEND_DIR/../inventario-backend"

if [[ ! -f "$BACKEND_CANDIDATE/manage.py" || ! -f "$BACKEND_CANDIDATE/requirements-macos.txt" ]]; then
  echo "No se encontró el backend preparado para macOS junto al frontend." >&2
  echo "Comprueba que inventario-frontend e inventario-backend sean carpetas hermanas y que exista requirements-macos.txt." >&2
  exit 1
fi

BACKEND_DIR="$(cd "$BACKEND_CANDIDATE" && pwd)"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Este comando debe ejecutarse en macOS." >&2
  exit 1
fi

if ! xcode-select -p >/dev/null 2>&1; then
  echo "Se abrirá el instalador de Xcode Command Line Tools."
  xcode-select --install 2>/dev/null || true
  echo "Termina la instalación y vuelve a ejecutar: bash build-macos.sh" >&2
  exit 2
fi

load_homebrew() {
  if [[ -x /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -x /usr/local/bin/brew ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
}

# Homebrew puede estar instalado aunque una terminal nueva aún no lo tenga en PATH.
load_homebrew
if ! command -v brew >/dev/null 2>&1; then
  echo "Instalando Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  load_homebrew
fi

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew se instaló, pero no quedó disponible en PATH. Cierra Terminal, ábrela y ejecuta nuevamente el script." >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Instalando Node.js 22 LTS y npm..."
  brew install node@22
  export PATH="$(brew --prefix node@22)/bin:$PATH"
fi

if ! command -v python3.11 >/dev/null 2>&1; then
  echo "Instalando Python 3.11..."
  brew install python@3.11
fi

if [[ -f "$HOME/.cargo/env" ]]; then
  # shellcheck disable=SC1091
  source "$HOME/.cargo/env"
fi

if ! command -v cargo >/dev/null 2>&1 || ! command -v rustc >/dev/null 2>&1; then
  echo "Instalando Rust estable con rustup..."
  curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh -s -- -y
  # shellcheck disable=SC1091
  source "$HOME/.cargo/env"
fi

for command in node npm cargo rustc python3.11; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "No se pudo preparar $command. Cierra Terminal, vuelve a abrirla y ejecuta otra vez el script." >&2
    exit 2
  fi
done

echo "Herramientas listas:"
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo "  Rust: $(rustc --version)"
echo "  Python: $(python3.11 --version)"

cd "$BACKEND_DIR"
python3.11 -m venv .venv-macos
"$BACKEND_DIR/.venv-macos/bin/python" -m pip install --upgrade pip
"$BACKEND_DIR/.venv-macos/bin/python" -m pip install -r requirements-macos.txt
"$BACKEND_DIR/.venv-macos/bin/python" -c "import pkg_resources" 2>/dev/null || {
  echo "No se pudo cargar pkg_resources. Comprueba la versión fijada de setuptools en requirements-macos.txt." >&2
  exit 1
}
"$BACKEND_DIR/.venv-macos/bin/python" manage.py migrate --noinput --settings=inventory.settings_desktop
"$BACKEND_DIR/.venv-macos/bin/python" manage.py collectstatic --noinput --settings=inventory.settings_desktop
"$BACKEND_DIR/.venv-macos/bin/python" -m PyInstaller --noconfirm --clean inventory.spec

cd "$FRONTEND_DIR"
npm ci
mkdir -p src-tauri/binaries
rm -rf src-tauri/binaries/inventory_backend
cp -R "$BACKEND_DIR/dist/inventory_backend" src-tauri/binaries/inventory_backend
npm run tauri -- icon public/elegant-lady-icon.png --output src-tauri/icons
npm run tauri -- build --config src-tauri/tauri.macos.conf.json --bundles app

cd "$BACKEND_DIR"
ADMIN_EXISTS="$("$BACKEND_DIR/.venv-macos/bin/python" manage.py shell --settings=inventory.settings_desktop -c 'from django.contrib.auth import get_user_model; print(get_user_model().objects.filter(is_superuser=True, is_active=True).exists())')"
if [[ "$ADMIN_EXISTS" == "False" ]]; then
  echo "Crea ahora el primer administrador de Elegant Lady. La contraseña no se mostrará."
  "$BACKEND_DIR/.venv-macos/bin/python" manage.py createsuperuser --settings=inventory.settings_desktop
else
  echo "Ya existe un administrador activo en la base de datos local."
fi

cd "$FRONTEND_DIR"
DMG_CREATED=false
if CI=true npm run tauri -- bundle --config src-tauri/tauri.macos.conf.json --bundles dmg; then
  DMG_CREATED=true
else
  echo "Aviso: la aplicación .app está lista, pero macOS no permitió crear el instalador DMG." >&2
  echo "Puedes usar la .app directamente o reintentar el DMG con el comando indicado en MACOS.md." >&2
fi

echo "Aplicación: $FRONTEND_DIR/src-tauri/target/release/bundle/macos"
if [[ "$DMG_CREATED" == "true" ]]; then
  echo "Instalador DMG: $FRONTEND_DIR/src-tauri/target/release/bundle/dmg"
fi
echo "Datos locales: $HOME/Library/Application Support/Elegant Lady"
