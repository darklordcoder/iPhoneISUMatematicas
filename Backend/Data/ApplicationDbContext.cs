using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) 
    {
        // Asegurar que la base de datos se cree
        Database.EnsureCreated();
    }

    public DbSet<WeatherForecast> WeatherForecasts { get; set; } = null!;
}
