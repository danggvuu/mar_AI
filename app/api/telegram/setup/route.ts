import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Chưa cấu hình TELEGRAM_BOT_TOKEN trên Vercel' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('url') || process.env.NEXT_PUBLIC_APP_URL;
    const providedKey = searchParams.get('key') || req.headers.get('x-admin-key');

    // Security: Only allow authenticated admin to register webhook
    const expectedKey = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PIN || 'danggvuu_admin_2026';
    if (!providedKey || providedKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Truy cập bị từ chối: Cần mã adminKey hợp lệ để cấu hình Webhook' },
        { status: 401 }
      );
    }

    if (!domain || domain.includes('localhost')) {
      return NextResponse.json({
        message: 'Telegram Webhook yêu cầu URL công khai HTTPS (ví dụ: https://your-app.vercel.app).',
      });
    }

    const webhookUrl = `${domain.replace(/\/$/, '')}/api/telegram/webhook`;
    const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET || 'tg_sec_' + expectedKey.slice(0, 16);

    // Register webhook with secret_token for end-to-end security
    const tgUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}&secret_token=${encodeURIComponent(secretToken)}&drop_pending_updates=true`;
    const res = await fetch(tgUrl);
    const data = await res.json();

    return NextResponse.json({
      success: true,
      registeredUrl: webhookUrl,
      telegramResponse: data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Lỗi cài đặt webhook' },
      { status: 500 }
    );
  }
}
