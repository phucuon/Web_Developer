namespace WebDeveloper.Models;

public class TelegramSettings
{
    public string BotToken { get; set; } = string.Empty;
    public string ChatId { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.telegram.org";
}
