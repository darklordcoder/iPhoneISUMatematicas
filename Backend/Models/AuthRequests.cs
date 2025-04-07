namespace Backend.Models;

public record RegisterRequest(string Username, string Password, string? FirstName = null, string? LastName = null, string? UserRole = null);
public record LoginRequest(string Username, string Password);
public record LogoutRequest(string Token);
public record ValidateTokenRequest(string Token); 