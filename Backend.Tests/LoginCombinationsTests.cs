using System.Net;
using System.Net.Http.Json;
using Backend.Models;
using Backend.Tests.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Text.Json;
using Xunit;

namespace Backend.Tests;

public class LoginCombinationsTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly JsonSerializerOptions _jsonOptions;

    public LoginCombinationsTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    [Theory]
    [InlineData("admin", "admin123", "Administrador")]
    [InlineData("profesor", "matematicas2024", "Profesor")]
    [InlineData("estudiante", "calculo2024!", "Estudiante")]
    public async Task Login_WithDifferentCredentials_ShouldBehaveCorrectly(string username, string password, string role)
    {
        // Arrange - Primero registramos el usuario
        var registerRequest = new RegisterRequest(username, password);
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Act - Intentamos hacer login
        var loginRequest = new LoginRequest(username, password);
        Console.WriteLine($"Sending login request for {username}");
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response status: {response.StatusCode}");
        Console.WriteLine($"Response content for {username}: {responseString}");
        Console.WriteLine($"Content type: {response.Content.Headers.ContentType}");
        Console.WriteLine($"Content length: {responseString.Length}");
        Console.WriteLine($"First character code: {(int)responseString[0]}");
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.NotNull(content.Token);

        // Validar el token
        var validateRequest = new ValidateTokenRequest(content?.Token ?? "");
        var validateResponse = await _client.PostAsJsonAsync("/api/auth/validate", validateRequest);
        var validateContent = await validateResponse.Content.ReadFromJsonAsync<ValidateResponse>(_jsonOptions);

        Assert.Equal(HttpStatusCode.OK, validateResponse.StatusCode);
        Assert.NotNull(validateContent);
        Assert.True(validateContent.IsValid);

        // Logout
        var logoutRequest = new LogoutRequest(content?.Token ?? "");
        var logoutResponse = await _client.PostAsJsonAsync("/api/auth/logout", logoutRequest);
        var logoutContent = await logoutResponse.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);
        Assert.NotNull(logoutContent);
        Assert.Equal("Successfully logged out", logoutContent.Message);
    }

    [Theory]
    [InlineData("admin", "wrongpass")]
    [InlineData("profesor", "wrong123")]
    [InlineData("estudiante", "invalid!")]
    public async Task Login_WithIncorrectPasswords_ShouldFail(string username, string wrongPassword)
    {
        // Arrange - Primero registramos el usuario con la contraseña correcta
        var correctPassword = "correctpass123";
        var registerRequest = new RegisterRequest(username, correctPassword);
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Act - Intentamos hacer login con la contraseña incorrecta
        var loginRequest = new LoginRequest(username, wrongPassword);
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response content for {username}: {responseString}");
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Incorrect password", content.Message);
    }

    [Theory]
    [InlineData("admin")]
    [InlineData("profesor")]
    [InlineData("estudiante")]
    public async Task Login_WithTooManyAttempts_ShouldLockAccount(string username)
    {
        // Arrange - Registrar el usuario
        var correctPassword = "correctpass123";
        var registerRequest = new RegisterRequest(username, correctPassword);
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Act - Intentar login múltiples veces con contraseña incorrecta
        var loginRequest = new LoginRequest(username, "wrongpass");
        
        for (int i = 0; i < 4; i++)
        {
            await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        }

        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response content for {username}: {responseString}");
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Account temporarily locked", content.Message);
    }
} 