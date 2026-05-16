using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using Microsoft.Extensions.Options;
using WebDeveloper.Models;

namespace WebDeveloper.Services;

public class EmailService : IEmailService
{
    private readonly HttpClient _http;
    private readonly BrevoSettings _settings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(HttpClient http, IOptions<BrevoSettings> settings, ILogger<EmailService> logger)
    {
        _http = http;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(string toAddress, string toName, string subject, string htmlBody)
    {
        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            _logger.LogWarning("Brevo API key not configured. Email skipped: {Subject} → {To}", subject, toAddress);
            return;
        }

        var payload = new
        {
            sender = new { name = Nfc(_settings.SenderName), email = _settings.SenderEmail },
            to = new[] { new { name = Nfc(toName), email = toAddress } },
            subject = Nfc(subject),
            htmlContent = Nfc(htmlBody)
        };

        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "smtp/email") { Content = JsonContent.Create(payload) };
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Add("api-key", _settings.ApiKey);

            using var response = await _http.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Brevo API failed {Status}: {Error}", response.StatusCode, error);
                throw new InvalidOperationException($"Brevo API returned {response.StatusCode}: {error}");
            }
            _logger.LogInformation("Sent email '{Subject}' to {To}", subject, toAddress);
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            _logger.LogError(ex, "Failed to send email '{Subject}' to {To}", subject, toAddress);
            throw;
        }
    }

    private static string Nfc(string s) => string.IsNullOrEmpty(s) ? s : s.Normalize(NormalizationForm.FormC);
}
