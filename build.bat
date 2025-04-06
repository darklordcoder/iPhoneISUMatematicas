@echo off
echo Building Docker image...

set VERSION=1.0.0
set IMAGE_NAME=phone-app
set DOCKER_HUB_USERNAME=darklordcoder

echo Cleaning up old images...
docker rmi %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:%VERSION% 2>nul
docker rmi %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:latest 2>nul

echo Building new image...
docker build -t %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:%VERSION% .
docker tag %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:%VERSION% %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:latest

echo.
echo Docker image built successfully!
echo Image details:
echo   Repository: %DOCKER_HUB_USERNAME%/%IMAGE_NAME%
echo   Version: %VERSION%
echo   Tags: latest, %VERSION%
echo.
docker images | findstr %DOCKER_HUB_USERNAME%/%IMAGE_NAME% 