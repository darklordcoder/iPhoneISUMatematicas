using System;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterUserAsync(
                request.Username, 
                request.Password,
                request.FirstName,
                request.LastName,
                request.UserRole
            );
            if (!result.success)
            {
                return BadRequest(new { message = result.message });
            }
            return Ok(new { message = result.message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "Internal server error during registration" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.AuthenticateAsync(request.Username, request.Password);
            if (!result.success)
            {
                return BadRequest(new { message = result.message });
            }
            return Ok(new { message = "Authentication successful", token = result.token });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "Internal server error during login" });
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
    {
        try
        {
            var result = await _authService.LogoutAsync(request.Token);
            if (!result)
            {
                return BadRequest(new { message = "Invalid or expired token" });
            }
            return Ok(new { message = "Successfully logged out" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, new { message = "Internal server error during logout" });
        }
    }

    [HttpPost("validate")]
    public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest request)
    {
        try
        {
            var isValid = await _authService.ValidateTokenAsync(request.Token);
            return Ok(new { isValid });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token validation");
            return StatusCode(
                500,
                new { message = "Internal server error during token validation" }
            );
        }
    }
}

public record RegisterRequest(string Username, string Password, string FirstName, string LastName, string UserRole);

public record LoginRequest(string Username, string Password);

public record LogoutRequest(string Token);

public record ValidateTokenRequest(string Token);
