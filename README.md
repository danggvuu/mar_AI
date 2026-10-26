# 🛒 AccStore - Website Marketing Bán Tài Khoản Bản Quyền

Website bán tài khoản số (Canva Pro, CapCut Pro, YouTube Premium, Gemini Advanced, ChatGPT Plus...) tối ưu chuyển đổi theo phong cách **MaKHive**, tích hợp **VietQR**, **animate-ui** và điều hướng chốt đơn tự động qua **Telegram Bot** và **Zalo**.

---

## 🌟 Tính Năng Nổi Bật

- 🎨 **Giao diện chuẩn phong cách MaKHive**: Dark Slate (`#0f172a`), màu nhấn cam (`#ee8722`), tối ưu chuyển đổi bán hàng.
- 💫 **Hiệu ứng animate-ui & Motion**: Background ambient gradient glow, dock liên hệ đàn hồi, thẻ sản phẩm 3D hover, modal auth và FAQ accordion trượt mượt mà.
- ⚡ **Flash Sale Countdown**: Đồng hồ đếm ngược giờ vàng kích thích mua hàng.
- 📱 **Floating Contact Dock**: Nút Zalo (`0963.973.205`) và Telegram Bot (`@Danggvuu_bot`) cố định góc dưới.
- 🛍️ **Mua hàng không cần đăng nhập (Guest Checkout)**: Khách chỉ cần nhập email là mua được ngay, không bắt buộc tạo tài khoản.
- 🤖 **Điều hướng Telegram Bot tự động 24/7**: Bấm mua -> sinh link `t.me/Danggvuu_bot?start=ord_xxx` -> Bot gửi bill, mã VietQR và nhả tài khoản (`email|pass|2fa`).
- 💬 **Điều hướng Zalo 1-Click**: Mở trực tiếp Zalo với tin nhắn soạn sẵn mã đơn và tên gói cần mua.
- 🔐 **Hệ thống Tài khoản (Auth)**: Modal Đăng nhập / Đăng ký không reload trang, lưu JWT an toàn.
- 📦 **Trang Quản lý Cá nhân (`/tai-khoan`)**: Xem lịch sử các đơn hàng và sao chép thông tin tài khoản đã mua.
- 🛡️ **Trang Admin (`/admin`)**: Khóa bảo vệ bằng mã PIN, quản lý đơn hàng, duyệt đơn, nạp kho tài khoản và đăng ký Webhook.
- 🔒 **Bảo mật cao**: Chống sửa giá client-side, xác thực Webhook Secret Token, HTTP Security Headers (chống Clickjacking, MIME sniffing).

---

## 🚀 Hướng Dẫn Deploy Lên Vercel (Miễn Phí 100%)

### Bước 1: Import vào Vercel
1. Truy cập [vercel.com/new](https://vercel.com/new) -> Đăng nhập bằng tài khoản GitHub.
2. Chọn repository **`danggvuu/mar_AI`** và bấm **Import**.

### Bước 2: Thêm Environment Variables
Tại mục **Environment Variables** trên Vercel Dashboard, thêm các biến sau:

| Tên biến | Giá trị mẫu | Mô tả |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | URL Vercel của trang web |
| `TELEGRAM_BOT_TOKEN` | `YOUR_BOT_TOKEN_FROM_BOTFATHER` | Token bot lấy từ @BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | `tg_sec_random_string_32_chars` | Chuỗi bí mật xác thực webhook |
| `ADMIN_SECRET_KEY` | `danggvuu_admin_2026` | Mã bí mật cấu hình webhook & mở khóa admin |
| `NEXT_PUBLIC_TELEGRAM_BOT` | `@Danggvuu_bot` | Username Telegram Bot |
| `NEXT_PUBLIC_ZALO_PHONE` | `0963973205` | Số điện thoại Zalo chốt đơn |
| `ZALO_PHONE` | `0963973205` | Số điện thoại liên hệ |
| `BANK_ACCOUNT_NUMBER` | `1032429169` | Số tài khoản ngân hàng nhận tiền |
| `BANK_ACCOUNT_NAME` | `DANG VU` | Tên chủ tài khoản ngân hàng |
| `BANK_CODE` | `VCB` | Mã ngân hàng (VCB, MB, TCB...) |
| `NEXTAUTH_SECRET` | `random_secret_string_min_32_chars` | Khóa ký JWT token tài khoản |
| `DATABASE_URL` | `postgresql://...` | Connection string Supabase (thêm khi sẵn sàng) |

3. Bấm nút **Deploy**. Website sẽ được build và online trong vòng ~1 phút.

---

### Bước 3: Kích Hoạt Telegram Bot Webhook
Sau khi trang web deploy xong và có domain Vercel:
1. Mở trang quản trị: `https://your-domain.vercel.app/admin`
2. Nhập mã PIN quản trị (ví dụ: `danggvuu_admin_2026`).
3. Chuyển sang tab **"Cấu hình Bot & Kênh"** -> bấm nút **"Đăng ký Webhook An Toàn với Telegram"**.
4. Khi đó mọi tin nhắn gửi đến `@Danggvuu_bot` sẽ được xử lý tự động và bảo mật qua máy chủ Vercel.

---

## 🗄️ Kết Nối Database Supabase (Khi sẵn sàng)

1. Tạo project trên [supabase.com](https://supabase.com).
2. Copy **Connection string (URI)** vào biến `DATABASE_URL` trên Vercel.
3. Chạy `npx prisma db push` để tạo bảng dữ liệu.
