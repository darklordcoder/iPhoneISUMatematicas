# Etapa 1: Build del frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

# Etapa 2: Build del backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app
COPY Backend/*.csproj ./Backend/
RUN dotnet restore Backend
COPY Backend/ ./Backend/
WORKDIR /app/Backend
RUN dotnet publish -c Release -o out

# Etapa 3: Imagen final
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /app/Backend/out ./
COPY --from=frontend-build /app/frontend/dist ./wwwroot

# Crear directorio para la base de datos
RUN mkdir -p /app/data && \
    chown -R 1000:1000 /app/data

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Backend.dll"] 