$ErrorActionPreference = 'Stop'
$frontend = $PSScriptRoot
$backend = Join-Path (Split-Path $frontend -Parent) 'inventario-backend'
$python = Join-Path $backend 'venv\Scripts\python.exe'
$vite = Join-Path $frontend 'node_modules\vite\bin\vite.js'
$viteArgument = '"' + $vite + '"'
$logs = Join-Path $frontend '.local-logs'

if (-not (Test-Path -LiteralPath $python)) { throw "Falta el entorno Python: $python" }
if (-not (Test-Path -LiteralPath $vite)) { throw "Faltan dependencias Node: ejecuta npm ci en inventario-frontend." }
New-Item -ItemType Directory -Path $logs -Force | Out-Null

function Test-Port([int]$port) {
    return [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

if (-not (Test-Port 8002)) {
    $process = Start-Process -FilePath $python -ArgumentList @('manage.py', 'runserver', '127.0.0.1:8002', '--noreload') -WorkingDirectory $backend -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logs 'django.out.log') -RedirectStandardError (Join-Path $logs 'django.err.log')
    Write-Host "Django iniciado (PID $($process.Id)) en http://127.0.0.1:8002/"
} else {
    Write-Host 'El puerto 8002 ya está ocupado; revisa el proceso antes de iniciar otro backend.'
}

if (-not (Test-Port 5173)) {
    Push-Location $frontend
    try { & node.exe $vite build --mode development; if ($LASTEXITCODE -ne 0) { throw 'Falló la compilación de Vue.' } }
    finally { Pop-Location }
    $process = Start-Process -FilePath 'node.exe' -ArgumentList @($viteArgument, 'preview', '--host', '127.0.0.1', '--port', '5173', '--strictPort') -WorkingDirectory $frontend -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logs 'vite.out.log') -RedirectStandardError (Join-Path $logs 'vite.err.log')
    Write-Host "Vue/Vite compilado e iniciado (PID $($process.Id)) en http://127.0.0.1:5173/"
} else {
    Write-Host 'El puerto 5173 ya está ocupado; revisa el proceso antes de iniciar otro frontend.'
}
