using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool IsDeleted { get; set; }
    public int UserId { get; set; }

    [Required]
    [StringLength(50)]
    public required string Username { get; set; }

    [Required]
    public required string PasswordHash { get; set; }

    public string? Salt { get; set; }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? UserRole { get; set; }
    public DateTime? LastLoginAttempt { get; set; }

    public int FailedLoginAttempts { get; set; }

    public DateTime? LockoutEnd { get; set; }

    public bool IsLocked => LockoutEnd.HasValue && LockoutEnd.Value > DateTime.UtcNow;
}
