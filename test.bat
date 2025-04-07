@echo off
echo Ejecutando pruebas unitarias...

REM Ejecutar las pruebas y mostrar solo el resultado
dotnet test Backend.Tests/Backend.Tests.csproj --filter "FullyQualifiedName~Auth" --logger "console;verbosity=detailed"

@REM start "" cmd /k "dotnet test Backend.Tests/Backend.Tests.csproj  --logger "console;verbosity=normal""

echo Pruebas unitarias completadas.
