using System.Net;
using WebDeveloper.Models;

namespace WebDeveloper.Services;

public static class TelegramTemplates
{
    public static string Contact(ContactRequest req) => $@"<b>🔔 LEAD MỚI — Liên hệ</b>

👤 <b>Họ tên:</b> {Esc(req.Name)}
📧 <b>Email:</b> {Esc(req.Email)}
📞 <b>SĐT:</b> {Esc(req.Phone)}
🎯 <b>Dịch vụ:</b> {Esc(req.Service)}
💰 <b>Ngân sách:</b> {Esc(req.Budget ?? "Chưa chọn")}

💬 <b>Mô tả:</b>
<i>{Esc(req.Message)}</i>

<i>Phản hồi khách trong 24h.</i>";

    public static string Popup(PopupConsultRequest req) => $@"<b>🔔 ĐĂNG KÝ TƯ VẤN — Popup</b>

👤 <b>Họ tên:</b> {Esc(req.Name)}
📧 <b>Email:</b> {Esc(req.Email)}
📞 <b>SĐT:</b> {Esc(req.Phone)}
🎯 <b>Dịch vụ:</b> {Esc(req.Service ?? "Chưa chọn")}";

    public static string Newsletter(string email) => $@"<b>📧 NEWSLETTER — Subscriber mới</b>

✉️ {Esc(email)}";

    private static string Esc(string s) => WebUtility.HtmlEncode(s ?? string.Empty);
}
