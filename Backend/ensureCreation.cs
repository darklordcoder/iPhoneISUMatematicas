using Backend.Data;

namespace Backend
{
    public static class EnsureCreation
    {
        public static void CreateEnvironment(WebApplicationBuilder builder, WebApplication app)
        {
            try
            {
                using (var scope = app.Services.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

                    logger.LogInformation("Intentando crear/migrar la base de datos...");

                    // Asegurarse de que el directorio existe y tiene los permisos correctos
                    var dbPath = builder.Configuration.GetConnectionString("DefaultConnection");
                    string? fullPath = null;

                    if (dbPath != null)
                    {
                        fullPath = dbPath.Replace("Data Source=", "");
                        var dbDir = Path.GetDirectoryName(fullPath);

                        if (dbDir != null)
                        {
                            if (!Directory.Exists(dbDir))
                            {
                                Directory.CreateDirectory(dbDir);
                                logger.LogInformation(
                                    $"Directorio de base de datos creado: {dbDir}"
                                );
                            }

                            // Asegurar permisos del directorio y archivo
                            if (OperatingSystem.IsLinux())
                            {
                                try
                                {
                                    // Establecer permisos en el directorio
                                    var chmodDirProcess = new System.Diagnostics.Process
                                    {
                                        StartInfo = new System.Diagnostics.ProcessStartInfo
                                        {
                                            FileName = "chmod",
                                            Arguments = $"-R 777 {dbDir}",
                                            RedirectStandardOutput = true,
                                            RedirectStandardError = true,
                                            UseShellExecute = false,
                                            CreateNoWindow = true,
                                        },
                                    };
                                    chmodDirProcess.Start();
                                    chmodDirProcess.WaitForExit();

                                    // Si el archivo existe, establecer permisos específicos
                                    if (File.Exists(fullPath))
                                    {
                                        var chmodFileProcess = new System.Diagnostics.Process
                                        {
                                            StartInfo = new System.Diagnostics.ProcessStartInfo
                                            {
                                                FileName = "chmod",
                                                Arguments = $"666 {fullPath}",
                                                RedirectStandardOutput = true,
                                                RedirectStandardError = true,
                                                UseShellExecute = false,
                                                CreateNoWindow = true,
                                            },
                                        };
                                        chmodFileProcess.Start();
                                        chmodFileProcess.WaitForExit();
                                    }

                                    logger.LogInformation(
                                        $"Permisos establecidos correctamente para el directorio y archivo de la base de datos"
                                    );
                                }
                                catch (Exception ex)
                                {
                                    logger.LogWarning(
                                        $"Error al establecer permisos: {ex.Message}"
                                    );
                                }
                            }
                        }
                    }

                    // Intentar crear/actualizar la base de datos
                    db.Database.EnsureCreated();

                    // Establecer permisos en el archivo después de crearlo
                    if (fullPath != null && OperatingSystem.IsLinux() && File.Exists(fullPath))
                    {
                        try
                        {
                            var chmodFileProcess = new System.Diagnostics.Process
                            {
                                StartInfo = new System.Diagnostics.ProcessStartInfo
                                {
                                    FileName = "chmod",
                                    Arguments = $"666 {fullPath}",
                                    RedirectStandardOutput = true,
                                    RedirectStandardError = true,
                                    UseShellExecute = false,
                                    CreateNoWindow = true,
                                },
                            };
                            chmodFileProcess.Start();
                            chmodFileProcess.WaitForExit();
                        }
                        catch (Exception ex)
                        {
                            logger.LogWarning(
                                $"Error al establecer permisos del archivo después de crearlo: {ex.Message}"
                            );
                        }
                    }

                    logger.LogInformation("Base de datos creada/verificada exitosamente");
                }
            }
            catch (Exception ex)
            {
                var logger = app.Services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Error al inicializar/migrar la base de datos");
                throw;
            }
        }
    }
}
