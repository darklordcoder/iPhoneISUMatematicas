using System.Security.Cryptography;
using System.Text;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AuthService
{
    // Constantes de seguridad
    private const int MAX_INTENTOS = 4;
    private const int TIEMPO_BLOQUEO = 600; // segundos
    private const int LONGITUD_MIN_PASSWORD = 8;
    private const int TIEMPO_EXPIRACION_TOKEN = 3600; // segundos

    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(bool success, string message, string? token)> AuthenticateAsync(string username, string password)
    {
        // Verificar existencia del usuario
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
        {
            return (false, "Usuario no registrado", null);
        }

        // Verificar si el usuario está bloqueado
        if (user.IsLocked)
        {
            return (false, "Usuario bloqueado temporalmente", null);
        }

        // Verificar credenciales
        var passwordHash = HashPassword(password, user.Salt ?? "");
        if (passwordHash != user.PasswordHash)
        {
            await AddFailedLoginAttempt(user);
            if (user.FailedLoginAttempts >= MAX_INTENTOS)
            {
                user.LockoutEnd = DateTime.UtcNow.AddSeconds(TIEMPO_BLOQUEO);
                await _context.SaveChangesAsync();
                return (false, "Cuenta bloqueada por múltiples intentos", null);
            }
            return (false, "Contraseña incorrecta", null);
        }

        // Generar token
        var token = await GenerateTokenAsync(user);
        
        // Limpiar intentos fallidos
        user.FailedLoginAttempts = 0;
        user.LastLoginAttempt = null;
        user.LockoutEnd = null;
        await _context.SaveChangesAsync();

        return (true, "Autenticación exitosa", token);
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        var authToken = await _context.AuthTokens
            .Include(t => t.User)
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
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddSeconds(TIEMPO_EXPIRACION_TOKEN)
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

    public async Task<(bool success, string message)> RegisterUserAsync(string username, string password)
    {
        // Validar longitud de contraseña
        if (password.Length < LONGITUD_MIN_PASSWORD)
        {
            return (false, $"La contraseña debe tener al menos {LONGITUD_MIN_PASSWORD} caracteres");
        }

        // Verificar si el usuario ya existe
        if (await _context.Users.AnyAsync(u => u.Username == username))
        {
            return (false, "El nombre de usuario ya está en uso");
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
            FailedLoginAttempts = 0
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return (true, "Usuario registrado exitosamente");
    }
} 