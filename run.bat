@echo off
echo Iniciando Backend y Frontend...

:: Limpiar y reconstruir el backend
cd Backend
dotnet clean
dotnet build
cd ..

:: Iniciar el backend en una nueva ventana
start "Backend" cmd /k "cd Backend && dotnet run --urls=https://localhost:7168"

:: Esperar más tiempo para que el backend inicie completamente
echo Esperando que el backend inicie...
timeout /t 1 /nobreak

:: Iniciar el frontend en una nueva ventana
start "Frontend" cmd /k "cd frontend && npm run dev -- --host"

echo Ambos servicios se están iniciando...
echo Backend: https://localhost:7168
echo Frontend: http://localhost:5173
echo.
echo Si el navegador muestra error de conexión, espera unos segundos más y recarga la página. 