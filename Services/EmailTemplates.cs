using System.Net;
using WebDeveloper.Models;

namespace WebDeveloper.Services;

public static class EmailTemplates
{
    private const string BrandPrimary = "#1E3A5F";
    private const string BrandAccent = "#B8860B";
    private const string BrandSecondary = "#E8B86E";
    private const string BrandBg = "#FAF6EE";

    public static string ContactCustomerReply(string customerName) => Wrap(
        title: "Cảm ơn bạn đã liên hệ!",
        body: $@"
            <p style='font-size:16px;'>Xin chào <strong>{Esc(customerName)}</strong>,</p>
            <p>Chúng tôi đã nhận được yêu cầu của bạn và rất vui khi được lắng nghe câu chuyện thương hiệu của bạn.</p>
            <p>Đội ngũ Nhớ Mãi sẽ phản hồi <strong style='color:{BrandAccent};'>trong vòng 24 giờ</strong> với báo giá chi tiết và roadmap dự án phù hợp.</p>
            <p>Trong lúc chờ đợi, bạn có thể tham khảo các dự án tiêu biểu của chúng tôi tại <a href='https://nhomai.vn/#portfolio' style='color:{BrandAccent};'>nhomai.vn</a>.</p>
            <p style='margin-top:32px;'>Trân trọng,<br><strong>Đội ngũ Nhớ Mãi Studio</strong></p>
        ");

    public static string ContactAdminNotify(ContactRequest req) => Wrap(
        title: "🔔 Lead mới từ form Liên hệ",
        body: $@"
            <table style='width:100%;border-collapse:collapse;font-size:14px;'>
                {Row("Họ tên", req.Name)}
                {Row("Email", $"<a href='mailto:{Esc(req.Email)}' style='color:{BrandAccent};'>{Esc(req.Email)}</a>")}
                {Row("Số điện thoại", $"<a href='tel:{Esc(req.Phone)}' style='color:{BrandAccent};'>{Esc(req.Phone)}</a>")}
                {Row("Dịch vụ", req.Service)}
                {Row("Ngân sách", req.Budget ?? "Chưa chọn")}
                {Row("Mô tả", req.Message)}
            </table>
            <p style='margin-top:24px;color:#6B7280;font-size:13px;'>Phản hồi khách trong vòng 24h để giữ chất lượng dịch vụ boutique.</p>
        ");

    public static string PopupCustomerReply(string customerName) => Wrap(
        title: "Cảm ơn bạn đã đăng ký tư vấn!",
        body: $@"
            <p>Xin chào <strong>{Esc(customerName)}</strong>,</p>
            <p>Cảm ơn bạn đã quan tâm đến dịch vụ của Nhớ Mãi Studio. Chuyên viên tư vấn sẽ liên hệ bạn <strong style='color:{BrandAccent};'>trong vòng 24 giờ</strong>.</p>
            <p>Trong lúc chờ đợi, bạn có thể xem qua quy trình 5 bước thiết kế của chúng tôi tại <a href='https://nhomai.vn/#process' style='color:{BrandAccent};'>nhomai.vn</a>.</p>
            <p style='margin-top:32px;'>Trân trọng,<br><strong>Đội ngũ Nhớ Mãi Studio</strong></p>
        ");

    public static string PopupAdminNotify(PopupConsultRequest req) => Wrap(
        title: "🔔 Đăng ký tư vấn mới (Popup)",
        body: $@"
            <table style='width:100%;border-collapse:collapse;font-size:14px;'>
                {Row("Họ tên", req.Name)}
                {Row("Email", req.Email)}
                {Row("Số điện thoại", req.Phone)}
                {Row("Dịch vụ", req.Service ?? "Chưa chọn")}
            </table>
        ");

    public static string NewsletterWelcome() => Wrap(
        title: "Chào mừng đến với Nhớ Mãi!",
        body: $@"
            <p>Bạn vừa đăng ký nhận tin từ Nhớ Mãi Studio — cảm ơn bạn rất nhiều!</p>
            <p>Mỗi tuần chúng tôi sẽ gửi bạn:</p>
            <ul>
                <li>Xu hướng thiết kế web mới nhất</li>
                <li>Cập nhật công nghệ .NET và lập trình</li>
                <li>Case study branding đáng nhớ</li>
            </ul>
            <p>Hẹn gặp bạn trong bản tin đầu tiên!</p>
            <p style='margin-top:32px;'>Trân trọng,<br><strong>Đội ngũ Nhớ Mãi Studio</strong></p>
        ");

    public static string NewsletterAdminNotify(string email) => Wrap(
        title: "📧 Có người mới đăng ký newsletter",
        body: $"<p>Email: <strong>{Esc(email)}</strong></p>");

    private static string Wrap(string title, string body) => $@"
<!DOCTYPE html>
<html lang='vi'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:{BrandBg};font-family:''Segoe UI'',Arial,sans-serif;color:{BrandPrimary};'>
    <table role='presentation' style='width:100%;background:{BrandBg};padding:40px 16px;'>
        <tr><td align='center'>
            <table role='presentation' style='max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(30,58,95,0.08);'>
                <tr><td style='background:{BrandPrimary};padding:32px;text-align:center;'>
                    <div style='font-family:Georgia,serif;font-size:28px;font-weight:600;color:{BrandSecondary};letter-spacing:2px;'>Nhớ Mãi</div>
                    <div style='font-size:11px;letter-spacing:6px;color:rgba(255,255,255,0.7);margin-top:6px;'>BOUTIQUE STUDIO</div>
                </td></tr>
                <tr><td style='padding:32px;'>
                    <h1 style='font-family:Georgia,serif;font-size:24px;color:{BrandPrimary};margin:0 0 24px;'>{title}</h1>
                    <div style='font-size:15px;line-height:1.7;color:#1E3A5F;'>{body}</div>
                </td></tr>
                <tr><td style='background:{BrandBg};padding:24px;text-align:center;font-size:12px;color:#6B7280;'>
                    <div style='margin-bottom:8px;'>Web đáng nhớ, mãi không phai</div>
                    <div>© 2026 Nhớ Mãi Studio · <a href='https://nhomai.vn' style='color:{BrandAccent};text-decoration:none;'>nhomai.vn</a></div>
                </td></tr>
            </table>
        </td></tr>
    </table>
</body>
</html>";

    private static string Row(string label, string value) => $@"
        <tr>
            <td style='padding:10px 12px;background:#FAF6EE;border-bottom:1px solid #E0DCC8;font-weight:600;color:{BrandPrimary};width:140px;'>{Esc(label)}</td>
            <td style='padding:10px 12px;border-bottom:1px solid #E0DCC8;'>{value}</td>
        </tr>";

    private static string Esc(string s) => WebUtility.HtmlEncode(s ?? string.Empty);
}
