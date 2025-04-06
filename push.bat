@echo off
echo Pushing Docker image to Docker Hub...

set VERSION=1.0.0
set IMAGE_NAME=phone-app
set DOCKER_HUB_USERNAME=darklordcoder

echo Logging into Docker Hub...
docker login

echo Tagging image for Docker Hub...
docker tag %IMAGE_NAME%:%VERSION% %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:%VERSION%
docker tag %IMAGE_NAME%:%VERSION% %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:latest

echo Pushing images to Docker Hub...
docker push %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:%VERSION%
docker push %DOCKER_HUB_USERNAME%/%IMAGE_NAME%:latest

echo Images pushed successfully! 