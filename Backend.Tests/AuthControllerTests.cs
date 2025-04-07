using System.Net;
using System.Net.Http.Json;
using Backend.Controllers;
using Backend.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Text.Json;
using Xunit;

namespace Backend.Tests;

public class AuthResponse
{
    public string? Message { get; set; }
    public string? Token { get; set; }
}

public class ValidateResponse
{
    public bool IsValid { get; set; }
}

public class AuthControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly JsonSerializerOptions _jsonOptions;

    public AuthControllerTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    [Fact]
    public async Task Register_WithValidData_ShouldSucceed()
    {
        // Arrange
        var registerRequest = new RegisterRequest("testuser", "password123");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Usuario registrado exitosamente", content.Message);
    }

    [Fact]
    public async Task Register_WithExistingUsername_ShouldFail()
    {
        // Arrange
        var registerRequest = new RegisterRequest("testuser2", "password123");
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("El nombre de usuario ya está en uso", content.Message);
    }

    [Fact]
    public async Task Register_WithShortPassword_ShouldFail()
    {
        // Arrange
        var registerRequest = new RegisterRequest("testuser3", "123");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Contains("La contraseña debe tener al menos", content.Message);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ShouldSucceed()
    {
        // Arrange
        var username = "testuser4";
        var password = "password123";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(username, password));
        var loginRequest = new LoginRequest(username, password);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.NotNull(content.Token);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ShouldFail()
    {
        // Arrange
        var loginRequest = new LoginRequest("nonexistent", "wrongpassword");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response content: {responseString}");

        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Usuario no registrado", content.Message);
    }

    [Fact]
    public async Task Login_WithTooManyAttempts_ShouldLockAccount()
    {
        // Arrange
        var username = "testuser5";
        var password = "password123";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(username, password));
        var loginRequest = new LoginRequest(username, "wrongpassword");

        // Act
        for (int i = 0; i < 4; i++)
        {
            await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        }
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Usuario bloqueado temporalmente", content.Message);
    }

    [Fact]
    public async Task Logout_WithValidToken_ShouldSucceed()
    {
        // Arrange
        var username = "testuser6";
        var password = "password123";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(username, password));
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(username, password));
        var loginContent = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);
        var logoutRequest = new LogoutRequest(loginContent?.Token ?? "");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/logout", logoutRequest);
        var content = await response.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Sesión cerrada exitosamente", content.Message);
    }

    [Fact]
    public async Task ValidateToken_WithValidToken_ShouldReturnTrue()
    {
        // Arrange
        var username = "testuser7";
        var password = "password123";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(username, password));
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(username, password));
        var loginContent = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>(_jsonOptions);
        var validateRequest = new ValidateTokenRequest(loginContent?.Token ?? "");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/validate", validateRequest);
        var content = await response.Content.ReadFromJsonAsync<ValidateResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.True(content.IsValid);
    }

    [Fact]
    public async Task ValidateToken_WithInvalidToken_ShouldReturnFalse()
    {
        // Arrange
        var validateRequest = new ValidateTokenRequest("invalid_token");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/validate", validateRequest);
        var content = await response.Content.ReadFromJsonAsync<ValidateResponse>(_jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.False(content.IsValid);
    }
} 