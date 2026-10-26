import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    if (password.length < 6 || password.length > 72) {
      return NextResponse.json(
        { error: 'Mật khẩu phải từ 6 đến 72 ký tự' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.toLowerCase().trim();
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Định dạng email không hợp lệ' },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      try {
        const existing = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (existing) {
          return NextResponse.json(
            { error: 'Email này đã được đăng ký' },
            { status: 409 }
          );
        }

        const user = await prisma.user.create({
          data: {
            email: cleanEmail,
            passwordHash: hashedPassword,
            fullName: fullName || cleanEmail.split('@')[0],
            role: 'USER',
          },
        });

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
      } catch (dbErr) {
        console.warn('DB error, using fallback demo registration:', dbErr);
      }
    }

    // Demo/Fallback registration when DB is not yet connected
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
        fullName: fullName || cleanEmail.split('@')[0],
        role: 'USER',
      },
    });
  } catch (error) {
    console.error('[POST /api/auth/register]', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
