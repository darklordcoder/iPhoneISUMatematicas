using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Deshabilitar HTTPS completamente
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(8080);
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add SQLite Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReactApp",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
    );
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Usar CORS
app.UseCors("AllowReactApp");

// Agregar soporte para archivos estáticos
app.UseDefaultFiles();
app.UseStaticFiles();

// Configurar el enrutamiento
app.UseRouting();

var summaries = new[]
{
    "Freezing",
    "Bracing",
    "Chilly",
    "Cool",
    "Mild",
    "Warm",
    "Balmy",
    "Hot",
    "Sweltering",
    "Scorching",
};

// Endpoint para obtener pronósticos
app.MapGet(
        "/weatherforecast",
        async (ApplicationDbContext db) =>
        {
            var forecasts = await db.WeatherForecasts.ToListAsync();
            if (!forecasts.Any())
            {
                // Si no hay datos, crear algunos de ejemplo
                forecasts = Enumerable
                    .Range(1, 5)
                    .Select(index => new WeatherForecast
                    {
                        Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                        TemperatureC = Random.Shared.Next(-20, 55),
                        Summary = summaries[Random.Shared.Next(summaries.Length)],
                    })
                    .ToList();

                await db.WeatherForecasts.AddRangeAsync(forecasts);
                await db.SaveChangesAsync();
            }
            return forecasts;
        }
    )
    .WithName("GetWeatherForecast")
    .WithOpenApi();

// Endpoint para crear un nuevo pronóstico
app.MapPost(
        "/weatherforecast",
        async (WeatherForecast forecast, ApplicationDbContext db) =>
        {
            db.WeatherForecasts.Add(forecast);
            await db.SaveChangesAsync();
            return Results.Created($"/weatherforecast/{forecast.Id}", forecast);
        }
    )
    .WithName("CreateWeatherForecast")
    .WithOpenApi();

// Fallback para SPA
app.MapFallbackToFile("index.html");

app.Run();
