namespace Backend.Models;

public record RegisterRequest(string Username, string Password, string FirstName, string LastName, string UserRole);
public record LoginRequest(string Username, string Password);
public record LogoutRequest(string Token);
public record ValidateTokenRequest(string Token); 