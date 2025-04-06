using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    public WeatherForecastController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<WeatherForecast>> Get()
    {
        var forecasts = await _context.WeatherForecasts.ToListAsync();
        if (!forecasts.Any())
        {
            // Si no hay datos, crear algunos de ejemplo
            forecasts = Enumerable
                .Range(1, 5)
                .Select(index => new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
                })
                .ToList();

            await _context.WeatherForecasts.AddRangeAsync(forecasts);
            await _context.SaveChangesAsync();
        }
        return forecasts;
    }

    [HttpPost]
    public async Task<IActionResult> Create(WeatherForecast forecast)
    {
        _context.WeatherForecasts.Add(forecast);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = forecast.Id }, forecast);
    }
} 