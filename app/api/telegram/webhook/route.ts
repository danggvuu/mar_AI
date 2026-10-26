import { NextRequest, NextResponse } from 'next/server';
import { Bot, webhookCallback } from 'grammy';
import { getVietQRUrl } from '@/lib/vietqr';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.warn('TELEGRAM_BOT_TOKEN is not configured in environment variables.');
}

// Lazy bot instantiation to prevent crashes if token is temporarily empty during build
const bot = new Bot(token || 'dummy_token_for_build');

// /start handler with deep-linking
bot.command('start', async (ctx) => {
  const payload = ctx.match; // e.g. "ord_abc123"

  if (payload && payload.startsWith('ord_')) {
    const orderRef = payload.toUpperCase();
    const qrUrl = getVietQRUrl({
      amount: 89000,
      orderId: orderRef,
      description: orderRef,
    });

    await ctx.reply(
      `🛒 *ĐƠN HÀNG CỦA BẠN: \`${orderRef}\`*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🔹 *Trạng thái:* Chờ thanh toán\n` +
      `🔹 *Số tài khoản:* \`${process.env.BANK_ACCOUNT_NUMBER || '1032429169'}\`\n` +
      `🔹 *Ngân hàng:* ${process.env.BANK_CODE || 'Vietcombank (VCB)'}\n` +
      `🔹 *Chủ TK:* ${process.env.BANK_ACCOUNT_NAME || 'DANG VU'}\n` +
      `🔹 *Nội dung CK:* \`${orderRef}\`\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📸 *Mã QR thanh toán VietQR chuyển nhanh:*`,
      { parse_mode: 'Markdown' }
    );

    try {
      await ctx.replyWithPhoto(qrUrl, {
        caption: `Quét mã QR để chuyển khoản chính xác nội dung "${orderRef}". Sau khi chuyển xong, hãy gõ lệnh /xacnhan để nhận tài khoản ngay!`,
      });
    } catch (err) {
      console.error('Error sending photo:', err);
    }
    return;
  }

  // Normal /start
  await ctx.reply(
    `👋 *Chào mừng bạn đến với AccStore!* 🎉\n\n` +
    `Cửa hàng cung cấp tài khoản bản quyền, công cụ AI, giải trí và học tập giá rẻ uy tín hàng đầu.\n\n` +
    `🌐 *Website đặt hàng:* ${process.env.NEXT_PUBLIC_APP_URL || 'https://makhive.com'}\n` +
    `📞 *Hotline / Zalo hỗ trợ:* ${process.env.ZALO_PHONE || '0963973205'} (https://zalo.me/${process.env.ZALO_PHONE || '0963973205'})\n\n` +
    `Gõ /help để xem các lệnh trợ giúp.`,
    { parse_mode: 'Markdown' }
  );
});

// /xacnhan handler
bot.command('xacnhan', async (ctx) => {
  await ctx.reply(
    `⏳ *Hệ thống đã ghi nhận yêu cầu xác nhận thanh toán!*\n\n` +
    `Hệ thống đang đối soát tự động giao dịch. Thông tin tài khoản sẽ được gửi trực tiếp tại đây trong vòng 1 - 3 phút.\n\n` +
    `Nếu cần hỗ trợ gấp, vui lòng liên hệ Zalo: https://zalo.me/${process.env.ZALO_PHONE || '0963973205'}`,
    { parse_mode: 'Markdown' }
  );
});

// /help handler
bot.command('help', async (ctx) => {
  await ctx.reply(
    `📌 *Danh sách lệnh hỗ trợ:*\n` +
    `• /start - Khởi động lại Bot\n` +
    `• /xacnhan - Xác nhận đã chuyển khoản thành công\n` +
    `• /lienhe - Thông tin liên hệ admin\n\n` +
    `Hotline: ${process.env.ZALO_PHONE || '0963973205'}\nZalo: https://zalo.me/${process.env.ZALO_PHONE || '0963973205'}`,
    { parse_mode: 'Markdown' }
  );
});

// /lienhe handler
bot.command('lienhe', async (ctx) => {
  await ctx.reply(
    `☎️ *KÊNH HỖ TRỢ KHÁCH HÀNG:*\n` +
    `• Zalo: ${process.env.ZALO_PHONE || '0963973205'} (https://zalo.me/${process.env.ZALO_PHONE || '0963973205'})\n` +
    `• Telegram: ${process.env.NEXT_PUBLIC_TELEGRAM_BOT || '@Danggvuu_bot'}\n` +
    `• Giờ làm việc: 24/7`,
    { parse_mode: 'Markdown' }
  );
});

// Fallback message
bot.on('message', async (ctx) => {
  await ctx.reply(
    `Bạn cần hỗ trợ đơn hàng hoặc mua tài khoản?\n` +
    `👉 Mở website: ${process.env.NEXT_PUBLIC_APP_URL || 'https://accstore.vn'}\n` +
    `👉 Hoặc Chat Zalo trực tiếp: https://zalo.me/${process.env.ZALO_PHONE || '0963973205'}`
  );
});

export async function POST(req: NextRequest) {
  try {
    if (!token) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN chưa được cấu hình' }, { status: 500 });
    }

    // Security: Verify secret token header from Telegram
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret) {
      const headerSecret = req.headers.get('x-telegram-bot-api-secret-token');
      if (headerSecret !== secret) {
        console.warn('[Security] Unauthorized Telegram Webhook request rejected');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const handler = webhookCallback(bot, 'std/http');
    return await handler(req);
  } catch (err: unknown) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Telegram Webhook is ready',
  });
}
