using System.Security.Cryptography;
using System.Text;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AuthService
{
    // Constantes de seguridad
    private const int MAX_LOGINATTEMPS = 4;
    private const int LOCK_TIME = 600; // segundos
    private const int PASWWORD_MIN_LENGTH = 8;
    private const int TOKEN_EXPIRATION_TIME = 3600; // segundos

    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(bool success, string message, string? token)> AuthenticateAsync(
        string username,
        string password
    )
    {
        // Verificar existencia del usuario
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
        {
            return (false, "User not registered", null);
        }

        // Verificar si el usuario está bloqueado
        if (user.IsLocked)
        {
            return (false, "Account temporarily locked", null);
        }

        // Verificar credenciales
        var passwordHash = HashPassword(password, user.Salt ?? "");
        if (passwordHash != user.PasswordHash)
        {
            await AddFailedLoginAttempt(user);
            if (user.FailedLoginAttempts >= MAX_LOGINATTEMPS)
            {
                user.LockoutEnd = DateTime.UtcNow.AddSeconds(LOCK_TIME);
                await _context.SaveChangesAsync();
                return (false, "Account locked due to multiple attempts", null);
            }
            return (false, "Incorrect password", null);
        }

        // Generar token
        var token = await GenerateTokenAsync(user);

        // Limpiar intentos fallidos
        user.FailedLoginAttempts = 0;
        user.LastLoginAttempt = null;
        user.LockoutEnd = null;
        await _context.SaveChangesAsync();

        return (true, "Authentication successful", token);
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        var authToken = await _context
            .AuthTokens.Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == token);

        if (authToken == null || authToken.IsExpired)
        {
            if (authToken != null)
            {
                _context.AuthTokens.Remove(authToken);
                await _context.SaveChangesAsync();
            }
            return false;
        }

        return true;
    }

    public async Task<bool> LogoutAsync(string token)
    {
        var authToken = await _context.AuthTokens.FirstOrDefaultAsync(t => t.Token == token);
        if (authToken != null)
        {
            _context.AuthTokens.Remove(authToken);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    private async Task AddFailedLoginAttempt(User user)
    {
        user.FailedLoginAttempts++;
        user.LastLoginAttempt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    private async Task<string> GenerateTokenAsync(User user)
    {
        // Generar token aleatorio
        var tokenBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(tokenBytes);
        }
        var token = Convert.ToBase64String(tokenBytes);

        // Crear registro de token
        var authToken = new AuthToken
        {
            Token = token,
            UserId = user.Id,
            LastName = user.LastName ?? "",
            FirstName = user.FirstName ?? "",
            UserRole = user.UserRole ?? "",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddSeconds(TOKEN_EXPIRATION_TIME),
        };

        await _context.AuthTokens.AddAsync(authToken);
        await _context.SaveChangesAsync();

        return token;
    }

    private string HashPassword(string password, string salt)
    {
        using var sha256 = SHA256.Create();
        var passwordWithSalt = password + salt;
        var bytes = Encoding.UTF8.GetBytes(passwordWithSalt);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public string GenerateSalt()
    {
        var saltBytes = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }
        return Convert.ToBase64String(saltBytes);
    }

    public async Task<(bool success, string message)> RegisterUserAsync(
        string username,
        string password,
        string? firstName = null,
        string? lastName = null,
        string? userRole = null
    )
    {
        // Validar longitud de contraseña
        if (password.Length < PASWWORD_MIN_LENGTH)
        {
            return (false, $"Password must be at least {PASWWORD_MIN_LENGTH} characters long");
        }

        // Verificar si el usuario ya existe
        if (await _context.Users.AnyAsync(u => u.Username == username))
        {
            return (false, "Username is already taken");
        }

        // Generar salt y hash de la contraseña
        var salt = GenerateSalt();
        var passwordHash = HashPassword(password, salt);

        // Crear nuevo usuario
        var user = new User
        {
            Username = username,
            PasswordHash = passwordHash,
            Salt = salt,
            FirstName = firstName,
            LastName = lastName,
            UserRole = userRole ?? "Usuario",
            FailedLoginAttempts = 0,
            CreatedAt = DateTime.UtcNow,
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return (true, "User successfully registered");
    }
}
