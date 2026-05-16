using System.Net.Http.Json;
using System.Text;
using Microsoft.Extensions.Options;
using WebDeveloper.Models;

namespace WebDeveloper.Services;

public class TelegramService : ITelegramService
{
    private readonly HttpClient _http;
    private readonly TelegramSettings _settings;
    private readonly ILogger<TelegramService> _logger;

    public TelegramService(HttpClient http, IOptions<TelegramSettings> settings, ILogger<TelegramService> logger)
    {
        _http = http;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(string text)
    {
        if (string.IsNullOrWhiteSpace(_settings.BotToken) || string.IsNullOrWhiteSpace(_settings.ChatId))
        {
            _logger.LogWarning("Telegram not configured. Notification skipped.");
            return;
        }

        var url = $"{_settings.BaseUrl.TrimEnd('/')}/bot{_settings.BotToken}/sendMessage";
        var payload = new
        {
            chat_id = _settings.ChatId,
            text = text.Normalize(NormalizationForm.FormC),
            parse_mode = "HTML",
            disable_web_page_preview = true
        };

        try
        {
            using var response = await _http.PostAsJsonAsync(url, payload);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                _logger.LogError("Telegram API failed {Status}: {Body}", response.StatusCode, body);
                return;
            }
            _logger.LogInformation("Telegram notification sent");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Telegram send failed");
        }
    }
}
