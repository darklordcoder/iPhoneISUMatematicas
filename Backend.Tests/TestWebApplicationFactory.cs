using Backend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Backend.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Data.Sqlite;
using System;
using Microsoft.Extensions.Hosting;

namespace Backend.Tests;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    private static readonly string ConnectionString = "DataSource=:memory:;Cache=Shared;Mode=ReadWriteCreate;Pooling=false";
    private static readonly SqliteConnection _connection;
    private static readonly object _lock = new object();
    private bool _disposed;

    static TestWebApplicationFactory()
    {
        _connection = new SqliteConnection(ConnectionString);
        _connection.Open();

        // Crear la base de datos inicialmente
        using var context = CreateNewContext();
        context.Database.EnsureCreated();
    }

    private static ApplicationDbContext CreateNewContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite(_connection)
            .EnableSensitiveDataLogging(false)
            .LogTo(_ => { }, LogLevel.Error) // Solo logs de error
            .Options;

        return new ApplicationDbContext(options);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureLogging(logging =>
        {
            logging.ClearProviders(); // Eliminar los providers por defecto
            logging.SetMinimumLevel(LogLevel.Warning); // Solo mostrar warnings y errores
        });

        builder.ConfigureServices(services =>
        {
            // Remover la configuración existente de DbContext
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Configurar el DbContext para usar SQLite en memoria con conexión compartida
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlite(_connection)
                       .EnableSensitiveDataLogging(false)
                       .LogTo(_ => { }, LogLevel.Error); // Solo logs de error
            }, ServiceLifetime.Scoped);

            // Registrar otros servicios necesarios
            services.AddScoped<AuthService>();

            // Construir el service provider
            var sp = services.BuildServiceProvider();

            // Crear un scope para obtener el contexto
            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<ApplicationDbContext>();

                try
                {
                    lock (_lock)
                    {
                        // Limpiar TODAS las tablas
                        db.Database.ExecuteSqlRaw("DELETE FROM AuthTokens");
                        db.Database.ExecuteSqlRaw("DELETE FROM Users");
                        db.SaveChanges();

                        // Reiniciar la secuencia de IDs
                        db.Database.ExecuteSqlRaw("DELETE FROM sqlite_sequence");
                        db.SaveChanges();
                    }
                }
                catch (Exception ex)
                {
                    var logger = scopedServices.GetRequiredService<ILogger<TestWebApplicationFactory>>();
                    logger.LogError(ex, "Error al limpiar la base de datos de prueba");
                    throw;
                }
            }
        });
    }

    protected override void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                // No cerramos la conexión aquí ya que es estática y la compartimos entre pruebas
            }

            _disposed = true;
        }

        base.Dispose(disposing);
    }
} 