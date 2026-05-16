using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using WebDeveloper.Models;

namespace WebDeveloper.Services;

public class RecaptchaService : IRecaptchaService
{
    private readonly HttpClient _http;
    private readonly RecaptchaSettings _settings;
    private readonly ILogger<RecaptchaService> _logger;

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
    };

    public RecaptchaService(HttpClient http, IOptions<RecaptchaSettings> settings, ILogger<RecaptchaService> logger)
    {
        _http = http;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<(bool Ok, string? Reason)> VerifyAsync(string token, string expectedAction)
    {
        if (string.IsNullOrWhiteSpace(_settings.SecretKey))
        {
            _logger.LogWarning("Recaptcha secret not configured. Skipping verification.");
            return (true, null);
        }

        if (string.IsNullOrWhiteSpace(token))
            return (false, "Thiếu mã xác thực reCAPTCHA.");

        try
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("secret", _settings.SecretKey),
                new KeyValuePair<string, string>("response", token)
            });

            using var response = await _http.PostAsync(_settings.VerifyUrl, content);
            var json = await response.Content.ReadAsStringAsync();

            var result = JsonSerializer.Deserialize<RecaptchaApiResponse>(json, JsonOpts);
            if (result is null)
                return (false, "Phản hồi reCAPTCHA không hợp lệ.");

            if (!result.Success)
            {
                var errors = string.Join(", ", result.ErrorCodes ?? Array.Empty<string>());
                _logger.LogWarning("Recaptcha verification failed: {Errors} | hostname={Host} action={Action} score={Score}", errors, result.Hostname, result.Action, result.Score);
                return (false, $"Xác thực reCAPTCHA thất bại ({errors}).");
            }

            if (!string.IsNullOrEmpty(expectedAction) && !string.Equals(result.Action, expectedAction, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Recaptcha action mismatch: expected={Expected} got={Got}", expectedAction, result.Action);
                return (false, "Hành động reCAPTCHA không khớp.");
            }

            if (result.Score < _settings.MinScore)
            {
                _logger.LogWarning("Recaptcha score too low: {Score} < {Min}", result.Score, _settings.MinScore);
                return (false, "Hệ thống nghi ngờ truy cập tự động, vui lòng thử lại.");
            }

            return (true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Recaptcha verify call failed");
            return (false, "Không kết nối được dịch vụ xác thực.");
        }
    }

    private class RecaptchaApiResponse
    {
        public bool Success { get; set; }
        public double Score { get; set; }
        public string? Action { get; set; }

        [JsonPropertyName("challenge_ts")]
        public string? ChallengeTs { get; set; }
        public string? Hostname { get; set; }

        [JsonPropertyName("error-codes")]
        public string[]? ErrorCodes { get; set; }
    }
}
