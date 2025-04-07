using System.Net;
using System.Net.Http.Json;
using Backend.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Text.Json;
using Xunit;

namespace Backend.Tests;

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
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Register response: {responseString}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("User successfully registered", content["message"]);
    }

    [Fact]
    public async Task Register_WithExistingUsername_ShouldFail()
    {
        // Arrange
        var registerRequest = new RegisterRequest("testuser2", "password123");
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Register (existing) response: {responseString}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Username is already taken", content["message"]);
    }

    [Fact]
    public async Task Register_WithShortPassword_ShouldFail()
    {
        // Arrange
        var registerRequest = new RegisterRequest("testuser3", "123");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Register (short password) response: {responseString}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Contains("Password must be at least", content["message"]);
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
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Login response: {responseString}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.NotNull(content["token"]);
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
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("User not registered", content["message"]);
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
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Response content: {responseString}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Account temporarily locked", content["message"]);
    }

    [Fact]
    public async Task Logout_WithValidToken_ShouldSucceed()
    {
        // Arrange
        var username = "testuser6";
        var password = "password123";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(username, password));
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(username, password));
        var loginContent = JsonSerializer.Deserialize<Dictionary<string, string>>(
            await loginResponse.Content.ReadAsStringAsync(), _jsonOptions);
        var logoutRequest = new LogoutRequest(loginContent["token"]);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/logout", logoutRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Logout response status: {response.StatusCode}");
        Console.WriteLine($"Logout response content: {responseString}");
        Console.WriteLine($"Logout content type: {response.Content.Headers.ContentType}");
        Console.WriteLine($"Logout content length: {responseString.Length}");
        var content = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.Equal("Successfully logged out", content["message"]);
    }

    [Fact]
    public async Task ValidateToken_WithValidToken_ShouldReturnTrue()
    {
        // Arrange
        var username = "testuser7";
        var password = "password123";
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(username, password));
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(username, password));
        var loginContent = JsonSerializer.Deserialize<Dictionary<string, string>>(
            await loginResponse.Content.ReadAsStringAsync(), _jsonOptions);
        var validateRequest = new ValidateTokenRequest(loginContent["token"]);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/validate", validateRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        var content = JsonSerializer.Deserialize<Dictionary<string, bool>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.True(content["isValid"]);
    }

    [Fact]
    public async Task ValidateToken_WithInvalidToken_ShouldReturnFalse()
    {
        // Arrange
        var validateRequest = new ValidateTokenRequest("invalid_token");

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/validate", validateRequest);
        var responseString = await response.Content.ReadAsStringAsync();
        var content = JsonSerializer.Deserialize<Dictionary<string, bool>>(responseString, _jsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(content);
        Assert.False(content["isValid"]);
    }
} 