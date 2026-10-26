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
    const { items, guestEmail, note, productName } = body;

    const tokenPayload = getUserFromRequest(req);

    // Validate email format if guest
    if (!tokenPayload) {
      if (!guestEmail || typeof guestEmail !== 'string') {
        return NextResponse.json(
          { error: 'Vui lòng nhập địa chỉ email để nhận tài khoản' },
          { status: 400 }
        );
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail.trim())) {
        return NextResponse.json(
          { error: 'Định dạng email không hợp lệ' },
          { status: 400 }
        );
      }
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fallbackOrderId = `ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT || '@Danggvuu_bot';
    const zaloPhone = process.env.NEXT_PUBLIC_ZALO_PHONE || '0963973205';

    // SERVER-SIDE PRICE CALCULATION (Prevents client-side parameter tampering)
    let calculatedTotal = 0;
    let selectedVariantLabel = '1 Năm';
    let verifiedProductName = productName || 'Tài khoản bản quyền';

    const firstItem = items?.[0];
    const targetVariantId = firstItem?.variantId;

    // Look up variant in MOCK_PRODUCTS to verify server price
    for (const prod of MOCK_PRODUCTS) {
      const matched = prod.variants.find((v) => v.id === targetVariantId);
      if (matched) {
        calculatedTotal = matched.salePrice;
        selectedVariantLabel = matched.label;
        verifiedProductName = prod.name;
        break;
      }
    }

    // Default fallback if variant not found in mock list
    if (calculatedTotal === 0) {
      calculatedTotal = 89000;
    }

    // Try DB first if DATABASE_URL is configured
    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      try {
        let dbTotal = 0;
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
            // Price computed strictly on server
            const price = Number(variant.salePrice ?? variant.price);
            dbTotal += price * Math.max(1, Math.min(10, Number(quantity) || 1));
            validatedItems.push({
              variantId,
              quantity: Math.max(1, Math.min(10, Number(quantity) || 1)),
              unitPrice: price,
              label: `${variant.product.name} - ${variant.label}`,
            });
          }
        }

        if (validatedItems.length > 0) {
          const order = await prisma.order.create({
            data: {
              userId: tokenPayload?.userId ?? null,
              guestEmail: tokenPayload ? null : guestEmail?.trim(),
              status: 'DRAFT',
              total: dbTotal,
              note: note ? String(note).slice(0, 500) : null,
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
            total: dbTotal,
            deepLink: getTelegramDeepLink(botUsername, telegramRef),
            zaloLink: getZaloPayUrl(zaloPhone, firstProd, telegramRef),
          });
        }
      } catch (dbErr) {
        console.warn('DB error, using verified fallback order:', dbErr);
      }
    }

    // Fallback response with server-calculated price
    const telegramRef = `ord_${fallbackOrderId.slice(-8).toLowerCase()}`;

    return NextResponse.json({
      success: true,
      orderId: fallbackOrderId,
      telegramRef,
      total: calculatedTotal,
      productName: verifiedProductName,
      variantLabel: selectedVariantLabel,
      deepLink: getTelegramDeepLink(botUsername, telegramRef),
      zaloLink: getZaloPayUrl(
        zaloPhone,
        `${verifiedProductName} (${selectedVariantLabel})`,
        telegramRef
      ),
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
