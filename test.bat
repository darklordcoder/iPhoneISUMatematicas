@echo off
echo Ejecutando pruebas unitarias...

REM Ejecutar las pruebas y mostrar solo el resultado
start "" cmd /k "dotnet test Backend.Tests/Backend.Tests.csproj --no-build --logger "console;verbosity=normal""

echo Pruebas unitarias completadas.
