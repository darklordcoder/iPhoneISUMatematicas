namespace Backend.Tests.Models;

public class AuthResponse
{
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
}

public class ValidateResponse
{
    public bool IsValid { get; set; }
} 