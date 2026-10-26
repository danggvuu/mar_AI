import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Chưa cấu hình TELEGRAM_BOT_TOKEN' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('url') || process.env.NEXT_PUBLIC_APP_URL;

    if (!domain || domain.includes('localhost')) {
      return NextResponse.json({
        message: 'Telegram Webhook yêu cầu một URL công khai (HTTPS). Sau khi deploy lên Vercel, hãy gọi: /api/telegram/setup?url=https://your-domain.vercel.app',
      });
    }

    const webhookUrl = `${domain.replace(/\/$/, '')}/api/telegram/webhook`;
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
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
