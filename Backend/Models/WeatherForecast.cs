using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class WeatherForecast
{
    [Key]
    public int Id { get; set; }
    public required DateOnly Date { get; set; }
    public required int TemperatureC { get; set; }
    public string? Summary { get; set; }
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
} 