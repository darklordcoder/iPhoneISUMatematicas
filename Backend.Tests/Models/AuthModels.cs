namespace Backend.Tests.Models;

public class RegisterRequest
{
    public string Username { get; set; }
    public string Password { get; set; }

    public RegisterRequest(string username, string password)
    {
        Username = username;
        Password = password;
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }

    public LoginRequest(string username, string password)
    {
        Username = username;
        Password = password;
    }
}

public class LogoutRequest
{
    public string Token { get; set; }

    public LogoutRequest(string token)
    {
        Token = token;
    }
}

public class ValidateTokenRequest
{
    public string Token { get; set; }

    public ValidateTokenRequest(string token)
    {
        Token = token;
    }
}

public class AuthResponse
{
    public string? Message { get; set; }
    public string? Token { get; set; }
}

public class ValidateResponse
{
    public bool IsValid { get; set; }
} 