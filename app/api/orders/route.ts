import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { getTelegramDeepLink, getZaloPayUrl } from '@/lib/vietqr';
import { MOCK_PRODUCTS } from '@/lib/products-data';

function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.replace('Bearer ', ''));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, guestEmail, note, productName, variantLabel, amount } = body;

    const tokenPayload = getUserFromRequest(req);

    if (!tokenPayload && !guestEmail) {
      return NextResponse.json(
        { error: 'Cần đăng nhập hoặc nhập email để đặt hàng' },
        { status: 400 }
      );
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fallbackOrderId = `ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT || '@Danggvuu_bot';
    const zaloPhone = process.env.NEXT_PUBLIC_ZALO_PHONE || '0963973205';

    // Try DB first if DATABASE_URL is configured
    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      try {
        let total = 0;
        const validatedItems: Array<{
          variantId: string;
          quantity: number;
          unitPrice: number;
          label: string;
        }> = [];

        for (const item of items || []) {
          const { variantId, quantity = 1 } = item;
          if (!variantId) continue;

          const variant = await prisma.variant.findUnique({
            where: { id: variantId },
            include: {
              product: { select: { name: true } },
            },
          });

          if (variant) {
            const price = Number(variant.salePrice ?? variant.price);
            total += price * quantity;
            validatedItems.push({
              variantId,
              quantity,
              unitPrice: price,
              label: `${variant.product.name} - ${variant.label}`,
            });
          }
        }

        if (validatedItems.length > 0) {
          const order = await prisma.order.create({
            data: {
              userId: tokenPayload?.userId ?? null,
              guestEmail: tokenPayload ? null : guestEmail,
              status: 'DRAFT',
              total,
              note: note ?? null,
              items: {
                create: validatedItems.map((i) => ({
                  variantId: i.variantId,
                  quantity: i.quantity,
                  unitPrice: i.unitPrice,
                })),
              },
            },
            include: {
              items: {
                include: { variant: { include: { product: true } } },
              },
            },
          });

          const telegramRef = `ord_${order.id.slice(0, 8)}`;
          await prisma.order.update({
            where: { id: order.id },
            data: { telegramRef },
          });

          const firstProd = order.items[0]?.variant?.product?.name ?? 'Tai khoan';
          return NextResponse.json({
            success: true,
            orderId: order.id,
            telegramRef,
            total,
            deepLink: getTelegramDeepLink(botUsername, telegramRef),
            zaloLink: getZaloPayUrl(zaloPhone, firstProd, telegramRef),
          });
        }
      } catch (dbErr) {
        console.warn('DB error, using fast fallback order:', dbErr);
      }
    }

    // Fallback order generation for fast preview & testing
    const fallbackTotal = amount || 89000;
    const prodName = productName || 'Tai khoan ban quyen';
    const telegramRef = `ord_${fallbackOrderId.slice(-8).toLowerCase()}`;

    return NextResponse.json({
      success: true,
      orderId: fallbackOrderId,
      telegramRef,
      total: fallbackTotal,
      productName: prodName,
      variantLabel: variantLabel || '1 Nam',
      deepLink: getTelegramDeepLink(botUsername, telegramRef),
      zaloLink: getZaloPayUrl(zaloPhone, `${prodName} (${variantLabel || ''})`, telegramRef),
    });
  } catch (error) {
    console.error('[POST /api/orders]', error);
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const tokenPayload = getUserFromRequest(req);
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Cần đăng nhập' }, { status: 401 });
    }

    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      try {
        const orders = await prisma.order.findMany({
          where: { userId: tokenPayload.userId },
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                variant: {
                  include: { product: { select: { name: true, slug: true } } },
                },
                stockItem: true,
              },
            },
          },
        });
        return NextResponse.json({ success: true, orders });
      } catch (dbErr) {
        console.warn('DB read error:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      orders: [],
    });
  } catch (error) {
    console.error('[GET /api/orders]', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
