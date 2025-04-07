using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class AuthToken
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public required string Token { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }
    
    [Required]
    public required DateTime CreatedAt { get; set; }
    
    [Required]
    public required DateTime ExpiresAt { get; set; }
    
    public bool IsExpired => DateTime.UtcNow > ExpiresAt;
} 