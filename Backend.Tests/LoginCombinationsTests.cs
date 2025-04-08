using System.Net;
using System.Net.Http.Json;
using Backend.Models;
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

    private async Task RegisterDefaultUsers()
    {
        // Registrar los usuarios predeterminados
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest("admin", "admin123", "Admin", "Admin", "Administrador"));
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest("profesor", "matematicas2024", "Profesor", "Test", "Profesor"));
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest("estudiante", "calculo2024!", "Estudiante", "Test", "Estudiante"));
    }

    [Theory]
    [InlineData("admin", "admin123", "Administrador")]
    [InlineData("profesor", "matematicas2024", "Profesor")]
    [InlineData("estudiante", "calculo2024!", "Estudiante")]
    public async Task Login_WithDifferentCredentials_ShouldBehaveCorrectly(string username, string password, string role)
    {
        // Arrange - Primero registramos los usuarios predeterminados
        await RegisterDefaultUsers();

        // Act - Intentamos hacer login
        var loginRequest = new LoginRequest(username, password);
        Console.WriteLine($"Sending login request for {username}");
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response status: {response.StatusCode}");
        Console.WriteLine($"Response content for {username}: {responseString}");
        Console.WriteLine($"Content type: {response.Content.Headers.ContentType}");
        Console.WriteLine($"Content length: {responseString.Length}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.NotNull(content["token"]);

        // Validar el token
        var validateRequest = new ValidateTokenRequest(content["token"]);
        var validateResponse = await _client.PostAsJsonAsync("/api/auth/validate", validateRequest);
        var validateString = await validateResponse.Content.ReadAsStringAsync();
        Console.WriteLine($"Validate response: {validateString}");
        var validateContent = JsonSerializer.Deserialize<Dictionary<string, bool>>(validateString, _jsonOptions);

        Assert.Equal(HttpStatusCode.OK, validateResponse.StatusCode);
        Assert.NotNull(validateContent);
        Assert.True(validateContent["isValid"]);

        // Logout
        var logoutRequest = new LogoutRequest(content["token"]);
        var logoutResponse = await _client.PostAsJsonAsync("/api/auth/logout", logoutRequest);
        var logoutContent = JsonSerializer.Deserialize<Dictionary<string, string>>(
            await logoutResponse.Content.ReadAsStringAsync(), _jsonOptions);

        Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);
        Assert.NotNull(logoutContent);
        Assert.Equal("Successfully logged out", logoutContent["message"]);
    }

    [Theory]
    [InlineData("admin", "wrongpass")]
    [InlineData("profesor", "wrong123")]
    [InlineData("estudiante", "invalid!")]
    public async Task Login_WithIncorrectPasswords_ShouldFail(string username, string wrongPassword)
    {
        // Arrange - Primero registramos los usuarios predeterminados
        await RegisterDefaultUsers();

        // Act - Intentamos hacer login con la contraseña incorrecta
        var loginRequest = new LoginRequest(username, wrongPassword);
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response content for {username}: {responseString}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Incorrect password", content["message"]);
    }

    [Theory]
    [InlineData("admin")]
    [InlineData("profesor")]
    [InlineData("estudiante")]
    public async Task Login_WithTooManyAttempts_ShouldLockAccount(string username)
    {
        // Arrange - Primero registramos los usuarios predeterminados
        await RegisterDefaultUsers();

        // Act - Intentar login múltiples veces con contraseña incorrecta
        var loginRequest = new LoginRequest(username, "wrongpass");
        
        for (int i = 0; i < 4; i++)
        {
            await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        }

        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response content for {username}: {responseString}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Account temporarily locked", content["message"]);
    }
} 