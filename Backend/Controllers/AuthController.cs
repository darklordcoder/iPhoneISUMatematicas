using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterUserAsync(request.Username, request.Password);
        if (!result.success)
        {
            return BadRequest(new { message = result.message });
        }
        return Ok(new { message = result.message });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.AuthenticateAsync(request.Username, request.Password);
        if (!result.success)
        {
            return BadRequest(new { message = result.message });
        }
        return Ok(new { token = result.token, message = result.message });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
    {
        var result = await _authService.LogoutAsync(request.Token);
        if (!result)
        {
            return BadRequest(new { message = "Token inválido o expirado" });
        }
        return Ok(new { message = "Sesión cerrada exitosamente" });
    }

    [HttpPost("validate")]
    public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest request)
    {
        var isValid = await _authService.ValidateTokenAsync(request.Token);
        return Ok(new { isValid });
    }
}

public record RegisterRequest(string Username, string Password);
public record LoginRequest(string Username, string Password);
public record LogoutRequest(string Token);
public record ValidateTokenRequest(string Token); 