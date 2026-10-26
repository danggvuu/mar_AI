import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_PRODUCTS } from '@/lib/products-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      try {
        const dbProduct = await prisma.product.findUnique({
          where: { slug },
          include: {
            variants: { orderBy: { sortOrder: 'asc' } },
            category: true,
          },
        });

        if (dbProduct) {
          const cheapest = dbProduct.variants[0];
          const originalPrice = Number(cheapest?.price || 0);
          const salePrice = Number(cheapest?.salePrice || originalPrice);
          const formatted = {
            id: dbProduct.id,
            name: dbProduct.name,
            slug: dbProduct.slug,
            category: dbProduct.categoryId,
            categoryName: dbProduct.category.name,
            thumbnailUrl: dbProduct.thumbnailUrl,
            icon: dbProduct.category.icon || '🔑',
            price: originalPrice,
            salePrice: salePrice,
            discount:
              originalPrice > salePrice
                ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
                : 0,
            warrantyDays: dbProduct.warrantyDays,
            soldCount: 800,
            isFeatured: dbProduct.isFeatured,
            description: dbProduct.description || '',
            instructions: dbProduct.instructions || '',
            variants: dbProduct.variants.map((v) => ({
              id: v.id,
              label: v.label,
              durationDays: v.durationDays || 30,
              price: Number(v.price),
              salePrice: Number(v.salePrice || v.price),
            })),
          };
          return NextResponse.json({ success: true, product: formatted });
        }
      } catch (dbErr) {
        console.warn('DB error fetching product by slug:', dbErr);
      }
    }

    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Lỗi lấy sản phẩm' },
      { status: 500 }
    );
  }
}
