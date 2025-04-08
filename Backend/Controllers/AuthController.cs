using System;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly ApplicationDbContext _context;

    public AuthController(AuthService authService, ILogger<AuthController> logger, ApplicationDbContext context)
    {
        _authService = authService;
        _logger = logger;
        _context = context;
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
            _logger.LogInformation($"Login attempt for user: {request.Username}");
            var result = await _authService.AuthenticateAsync(request.Username, request.Password);
            _logger.LogInformation($"Authentication result: {result.success}, Message: {result.message}");

            if (!result.success)
            {
                _logger.LogWarning($"Login failed for user {request.Username}: {result.message}");
                return BadRequest(new { message = result.message });
            }

            // Obtener el token recién creado con los datos del usuario
            var authToken = await _context.AuthTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == result.token);

            if (authToken == null)
            {
                _logger.LogError("Token not found after successful authentication");
                return StatusCode(500, new { message = "Error retrieving user data" });
            }

            return Ok(new { 
                message = "Authentication successful", 
                token = result.token,
                firstName = authToken.FirstName,
                lastName = authToken.LastName,
                userRole = authToken.UserRole
            });
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
