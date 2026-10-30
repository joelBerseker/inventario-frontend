# inventario-frontend

Para compilar Elegant Lady en un Mac, consulta [MACOS.md](MACOS.md) y ejecuta `bash build-macos.sh`.

En Windows, para iniciar Django y la interfaz local sin depender del Python de Miniconda, ejecuta desde esta carpeta:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\start-local.ps1
```

La interfaz queda en `http://127.0.0.1:5173/` y Django en `http://127.0.0.1:8002/`. El script usa `inventario-backend/venv/Scripts/python.exe`, compila Vue en modo de desarrollo y sirve el resultado; los errores se guardan en `.local-logs/`. El puerto 8001 se reserva para la instalación de inventario que ya está en ejecución en este equipo.
Frontend Inventory Project by Gleaming Glow Team
 
## Getting Started
Inventory management project for small businesses and more.
## Authors

* **Joel Atamari** - *Initial work* - [JoelBersek](https://github.com/joelBerseker)
* **Jhon Mamani** - *Lead designer* - [Leowin](https://github.com/leowi)
* **Alexander Cayro** - *Backend Developer* - [Alexander Rey](https://github.com/reyalexander)

## Install
### Requirements Frontend
* node == v18.16.0



Run them install the project the following commands:
```bash
npm install
```
Run them usint the project the following commands:
```bash
npm run dev
```
Creates a build directory with a production build of your app:
```bash
npm run build
```
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
