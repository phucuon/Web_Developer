namespace WebDeveloper.Services;

public interface ITelegramService
{
    Task SendAsync(string text);
}
