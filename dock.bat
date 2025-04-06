@echo off
echo Starting test environment...

REM Asegurarse de que tenemos la última versión de la imagen local
call build.bat

REM Detener y eliminar contenedores existentes
echo Cleaning up existing containers...
docker-compose down

REM Iniciar los servicios
echo Starting services...
docker-compose up -d

REM Esperar un momento para que el servicio inicie
timeout /t 5 /nobreak

REM Mostrar los logs iniciales
echo Showing initial logs...
docker-compose logs

echo.
echo Test environment is ready!
echo.
echo URLs de acceso:
echo   HTTP:  http://localhost:8080
echo   HTTPS: https://localhost:8443
echo.
echo Comandos útiles:
echo   - Ver logs: docker-compose logs -f
echo   - Detener servicios: docker-compose down
echo   - Reiniciar servicios: docker-compose restart
echo.
echo Presiona Ctrl+C para detener la visualización de logs
echo Para detener los servicios, ejecuta: docker-compose down 