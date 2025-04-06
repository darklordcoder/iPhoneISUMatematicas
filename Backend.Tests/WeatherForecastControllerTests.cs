using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace Backend.Tests;

public class WeatherForecastControllerTests
{
    private ApplicationDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task Get_SinDatos_DebeRetornarCincoPronosticos()
    {
        // Arrange
        using var context = GetDbContext();
        var controller = new WeatherForecastController(context);

        // Act
        var result = await controller.Get();

        // Assert
        var forecasts = Assert.IsAssignableFrom<IEnumerable<WeatherForecast>>(result);
        Assert.Equal(5, forecasts.Count());
    }

    [Fact]
    public async Task Get_ConDatosExistentes_DebeRetornarDatosExistentes()
    {
        // Arrange
        using var context = GetDbContext();
        var existingForecast = new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now),
            TemperatureC = 25,
            Summary = "Test"
        };
        context.WeatherForecasts.Add(existingForecast);
        await context.SaveChangesAsync();

        var controller = new WeatherForecastController(context);

        // Act
        var result = await controller.Get();

        // Assert
        var forecasts = Assert.IsAssignableFrom<IEnumerable<WeatherForecast>>(result);
        Assert.Single(forecasts);
        var forecast = forecasts.First();
        Assert.Equal(existingForecast.Date, forecast.Date);
        Assert.Equal(existingForecast.TemperatureC, forecast.TemperatureC);
        Assert.Equal(existingForecast.Summary, forecast.Summary);
    }

    [Fact]
    public async Task Create_DebeGuardarYRetornarNuevoPronostico()
    {
        // Arrange
        using var context = GetDbContext();
        var controller = new WeatherForecastController(context);
        var newForecast = new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now),
            TemperatureC = 30,
            Summary = "New Test"
        };

        // Act
        var result = await controller.Create(newForecast);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        var returnValue = Assert.IsType<WeatherForecast>(createdResult.Value);
        Assert.Equal(newForecast.Date, returnValue.Date);
        Assert.Equal(newForecast.TemperatureC, returnValue.TemperatureC);
        Assert.Equal(newForecast.Summary, returnValue.Summary);

        // Verificar que se guardó en la base de datos
        var savedForecast = await context.WeatherForecasts.FirstOrDefaultAsync();
        Assert.NotNull(savedForecast);
        Assert.Equal(newForecast.Date, savedForecast.Date);
        Assert.Equal(newForecast.TemperatureC, savedForecast.TemperatureC);
        Assert.Equal(newForecast.Summary, savedForecast.Summary);
    }
} 