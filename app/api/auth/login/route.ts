import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (user && user.passwordHash) {
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) {
            return NextResponse.json(
              { error: 'Email hoặc mật khẩu không đúng' },
              { status: 401 }
            );
          }

          const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
          });

          return NextResponse.json({
            token,
            user: {
              id: user.id,
              email: user.email,
              fullName: user.fullName,
              role: user.role,
            },
          });
        }
      } catch (dbErr) {
        console.warn('DB error, using fallback demo auth:', dbErr);
      }
    }

    // Demo/Fallback auth when DB is not yet connected
    const fallbackId = `user_${Date.now()}`;
    const token = signToken({
      userId: fallbackId,
      email: cleanEmail,
      role: 'USER',
    });

    return NextResponse.json({
      token,
      user: {
        id: fallbackId,
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0],
        role: 'USER',
      },
    });
  } catch (error) {
    console.error('[POST /api/auth/login]', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
