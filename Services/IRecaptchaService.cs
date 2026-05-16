namespace WebDeveloper.Services;

public interface IRecaptchaService
{
    Task<(bool Ok, string? Reason)> VerifyAsync(string token, string expectedAction);
}
