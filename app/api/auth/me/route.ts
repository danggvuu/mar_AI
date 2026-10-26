import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Không có token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 });
    }

    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            telegramId: true,
            createdAt: true,
          },
        });

        if (user) {
          return NextResponse.json({ success: true, user });
        }
      } catch (dbErr) {
        console.warn('DB error reading user:', dbErr);
      }
    }

    // Fallback user from verified token
    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        fullName: payload.email.split('@')[0],
        role: payload.role || 'USER',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[GET /api/auth/me]', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
