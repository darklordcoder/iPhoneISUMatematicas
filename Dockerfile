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

# Instalar herramientas necesarias
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no root
# RUN useradd -u 1000 -r -s /bin/false -d /app appuser && \
#     mkdir -p /app/database && \
#     chown -R appuser:appuser /app && \
#     chmod -R 755 /app && \
#     chmod 777 /app/database

WORKDIR /app

# Copiar archivos de la aplicación
COPY --from=backend-build /app/Backend/out ./
COPY --from=frontend-build /app/frontend/dist ./wwwroot

# Asegurar permisos después de copiar los archivos
# RUN chown -R appuser:appuser /app && \
#     chmod -R 755 /app && \
#     chmod 777 /app/database

# Configurar variables de entorno
ENV ASPNETCORE_URLS=http://+:8080

# Cambiar al usuario no root
# USER appuser

EXPOSE 8080
ENTRYPOINT ["dotnet", "Backend.dll"] 