using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using WebDeveloper.Models;
using WebDeveloper.Services;

namespace WebDeveloper.Controllers;

[ApiController]
[Route("api")]
[EnableRateLimiting("api")]
public class ContactApiController : ControllerBase
{
    private readonly IEmailService _email;
    private readonly IRecaptchaService _recaptcha;
    private readonly ITelegramService _telegram;
    private readonly BrevoSettings _settings;
    private readonly ILogger<ContactApiController> _logger;

    public ContactApiController(IEmailService email, IRecaptchaService recaptcha, ITelegramService telegram, IOptions<BrevoSettings> settings, ILogger<ContactApiController> logger)
    {
        _email = email;
        _recaptcha = recaptcha;
        _telegram = telegram;
        _settings = settings.Value;
        _logger = logger;
    }

    [HttpPost("contact")]
    public Task<IActionResult> Contact([FromBody] ContactRequest req) =>
        ProcessAsync(req.RecaptchaToken, "contact", "Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 24 giờ.", () =>
        [
            _email.SendAsync(req.Email, req.Name, "Cảm ơn bạn đã liên hệ Nhớ Mãi Studio", EmailTemplates.ContactCustomerReply(req.Name)),
            NotifyAdmin($"[Lead mới] {req.Service} – {req.Name}", EmailTemplates.ContactAdminNotify(req)),
            _telegram.SendAsync(TelegramTemplates.Contact(req))
        ]);

    [HttpPost("popup")]
    public Task<IActionResult> Popup([FromBody] PopupConsultRequest req) =>
        ProcessAsync(req.RecaptchaToken, "popup", "Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 24 giờ.", () =>
        [
            _email.SendAsync(req.Email, req.Name, "Cảm ơn bạn đã đăng ký tư vấn", EmailTemplates.PopupCustomerReply(req.Name)),
            NotifyAdmin($"[Đăng ký tư vấn] {req.Name}", EmailTemplates.PopupAdminNotify(req)),
            _telegram.SendAsync(TelegramTemplates.Popup(req))
        ]);

    [HttpPost("newsletter")]
    public Task<IActionResult> Newsletter([FromBody] NewsletterRequest req) =>
        ProcessAsync(req.RecaptchaToken, "newsletter", "Cảm ơn bạn đã đăng ký nhận tin!", () =>
        [
            _email.SendAsync(req.Email, req.Email, "Chào mừng đến với Nhớ Mãi Studio", EmailTemplates.NewsletterWelcome()),
            NotifyAdmin("[Newsletter] Subscriber mới", EmailTemplates.NewsletterAdminNotify(req.Email)),
            _telegram.SendAsync(TelegramTemplates.Newsletter(req.Email))
        ]);

    private async Task<IActionResult> ProcessAsync(string? token, string action, string successMessage, Func<Task[]> emailTasks)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = FirstError() });

        var (ok, reason) = await _recaptcha.VerifyAsync(token ?? string.Empty, action);
        if (!ok) return BadRequest(new { success = false, message = reason ?? "Xác thực reCAPTCHA thất bại." });

        try
        {
            await Task.WhenAll(emailTasks());
            return Ok(new { success = true, message = successMessage });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "{Action} failed", action);
            return StatusCode(500, new { success = false, message = "Có lỗi xảy ra, vui lòng thử lại sau." });
        }
    }

    private Task NotifyAdmin(string subject, string html) =>
        string.IsNullOrWhiteSpace(_settings.AdminEmail)
            ? Task.CompletedTask
            : _email.SendAsync(_settings.AdminEmail, _settings.AdminName, subject, html);

    private string FirstError() =>
        ModelState.Values.SelectMany(v => v.Errors).FirstOrDefault()?.ErrorMessage ?? "Dữ liệu không hợp lệ.";
}
