namespace WebDeveloper.Models;

public class BrevoSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.brevo.com/v3";
    public string SenderName { get; set; } = "Nhớ Mãi Studio";
    public string SenderEmail { get; set; } = string.Empty;
    public string AdminName { get; set; } = "Admin";
    public string AdminEmail { get; set; } = string.Empty;
}
