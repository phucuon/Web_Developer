namespace WebDeveloper.Models;

public class RecaptchaSettings
{
    public string SiteKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public double MinScore { get; set; } = 0.5;
    public string VerifyUrl { get; set; } = "https://www.google.com/recaptcha/api/siteverify";
}

public class RecaptchaVerifyResponse
{
    public bool Success { get; set; }
    public double Score { get; set; }
    public string? Action { get; set; }
    public DateTime ChallengeTs { get; set; }
    public string? Hostname { get; set; }
    public string[]? ErrorCodes { get; set; }
}
