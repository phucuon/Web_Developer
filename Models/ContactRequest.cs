using System.ComponentModel.DataAnnotations;

namespace WebDeveloper.Models;

public class ContactRequest
{
    [Required(ErrorMessage = "Vui lòng nhập họ tên")]
    [MinLength(2, ErrorMessage = "Họ tên phải có ít nhất 2 ký tự")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập email")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
    [RegularExpression(@"^(0|\+84)[0-9]{9,10}$", ErrorMessage = "Số điện thoại không hợp lệ")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng chọn dịch vụ")]
    public string Service { get; set; } = string.Empty;

    public string? Budget { get; set; }

    [Required(ErrorMessage = "Vui lòng mô tả dự án")]
    [MinLength(10, ErrorMessage = "Mô tả ít nhất 10 ký tự")]
    public string Message { get; set; } = string.Empty;

    [Required(ErrorMessage = "Bạn cần đồng ý điều khoản")]
    [Range(typeof(bool), "true", "true", ErrorMessage = "Bạn cần đồng ý điều khoản")]
    public bool Consent { get; set; }

    public string? RecaptchaToken { get; set; }
}

public class NewsletterRequest
{
    [Required(ErrorMessage = "Vui lòng nhập email")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    public string? RecaptchaToken { get; set; }
}

public class PopupConsultRequest
{
    [Required(ErrorMessage = "Vui lòng nhập họ tên")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
    [RegularExpression(@"^(0|\+84)[0-9]{9,10}$", ErrorMessage = "Số điện thoại không hợp lệ")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập email")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    public string? Service { get; set; }

    public string? RecaptchaToken { get; set; }
}
