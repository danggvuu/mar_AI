# 🛒 AccStore - Website Marketing Bán Tài Khoản Bản Quyền

Website bán tài khoản số (Canva Pro, CapCut Pro, YouTube Premium, Gemini, ChatGPT...) xây dựng bằng **Next.js 15 App Router**, **Tailwind CSS**, tích hợp **Auth**, **VietQR**, và điều hướng tự động qua **Telegram Bot (@Danggvuu_bot)** và **Zalo (0963.973.205)**.

---

## 🚀 Tính Năng Nổi Bật

- 🎨 **Giao diện chuẩn phong cách MaKHive (makhive.com)**: Dark Slate (`#0f172a`), màu cam công nghệ (`#ee8722`), tối ưu chuyển đổi cao (CRO).
- ⚡ **Flash Sale Countdown**: Đồng hồ đếm ngược giờ vàng kích thích mua hàng.
- 📱 **Floating Contact Dock**: Nút Zalo (`0963973205`) và Telegram Bot (`@Danggvuu_bot`) cố định góc phải.
- 🛍️ **Mua hàng không cần đăng nhập (Guest Checkout)**: Khách chỉ cần nhập email là mua được ngay, không ép buộc tạo tài khoản.
- 🤖 **Điều hướng Telegram Bot tự động 24/7**: Bấm mua -> sinh link `t.me/Danggvuu_bot?start=ord_xxx` -> Bot tự động gửi bill, mã VietQR và nhả tài khoản (`email|pass|2fa`).
- 💬 **Điều hướng Zalo 1-Click**: Mở trực tiếp Zalo với tin nhắn soạn sẵn mã đơn và sản phẩm cần mua.
- 🔐 **Hệ thống Tài khoản (Auth)**: Modal Đăng nhập / Đăng ký không reload trang, lưu JWT an toàn.
- 📦 **Trang Quản lý Cá nhân (`/tai-khoan`)**: Xem lịch sử các đơn hàng và sao chép thông tin tài khoản đã mua.
- ⚙️ **Trang Admin (`/admin`)**: Quản lý đơn hàng, duyệt đơn và nạp kho tài khoản hàng loạt.
- 🔍 **Chuẩn SEO Google**: SSG/SSR, tốc độ tải trang dưới 1 giây.

---

## 🛠️ Hướng Dẫn Chạy Local

1. **Cài đặt thư viện**:
```bash
npm install
```

2. **Sinh Prisma Client**:
```bash
npx prisma generate
```

3. **Chạy server phát triển**:
```bash
npm run dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## 🌐 Hướng Dẫn Đẩy Lên GitHub & Deploy Vercel (Miễn Phí)

### Bước 1: Tạo repo trên GitHub và đẩy code lên
```bash
git init
git add .
git commit -m "feat: initial commit accstore web marketing"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Bước 2: Import vào Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Chọn **"Add New..."** -> **"Project"** -> chọn repo vừa tạo.
3. Trong mục **Environment Variables**, thêm các biến sau:
   - `NEXT_PUBLIC_APP_URL`: URL Vercel của bạn (ví dụ: `https://your-domain.vercel.app`)
   - `TELEGRAM_BOT_TOKEN`: `8934646504:AAHjWH9P9iabdCNLyHY1epnoIcNohCfwZBU`
   - `BANK_ACCOUNT_NUMBER`: `1032429169`
   - `BANK_ACCOUNT_NAME`: `DANG VU`
   - `BANK_CODE`: `VCB`
   - `ZALO_PHONE`: `0963973205`
   - `NEXT_PUBLIC_TELEGRAM_BOT`: `@Danggvuu_bot`
   - `NEXT_PUBLIC_ZALO_PHONE`: `0963973205`
   - `NEXTAUTH_SECRET`: Một chuỗi ngẫu nhiên bất kỳ (từ 32 ký tự trở lên)
   - `DATABASE_URL`: (Sau khi tạo Supabase, paste connection string vào đây)
4. Nhấn **"Deploy"**. Website sẽ hoạt động chỉ sau ~1 phút!

### Bước 3: Kích hoạt Webhook Telegram Bot (Chỉ 1 Click)
Sau khi có domain trên Vercel, mở trình duyệt và truy cập:
```
https://your-domain.vercel.app/api/telegram/setup?url=https://your-domain.vercel.app
```
Hoặc vào trang `/admin` bấm nút **"Đăng ký Webhook với Telegram"**!
Khi đó mọi tin nhắn gửi tới `@Danggvuu_bot` sẽ được xử lý tự động bởi server Vercel.

---

## 🗄️ Cấu hình Supabase (Khi sẵn sàng)

1. Tạo project mới trên [supabase.com](https://supabase.com).
2. Vào **Project Settings** -> **Database** -> sao chép **Connection string (URI)** (chế độ Transaction / Pooled).
3. Cập nhật biến `DATABASE_URL` trong file `.env.local` hoặc trên Vercel:
```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```
4. Đẩy schema lên database:
```bash
npx prisma db push
```
