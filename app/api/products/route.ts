import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_PRODUCTS } from '@/lib/products-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      try {
        const whereClause: Record<string, unknown> = { isActive: true };

        if (category && category !== 'all') {
          whereClause.categoryId = category;
        }

        if (featured === 'true') {
          whereClause.isFeatured = true;
        }

        if (search) {
          whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
        }

        const dbProducts = await prisma.product.findMany({
          where: whereClause,
          include: {
            variants: { orderBy: { sortOrder: 'asc' } },
            category: true,
          },
          orderBy: { createdAt: 'asc' },
        });

        if (dbProducts.length > 0) {
          const formatted = dbProducts.map((p) => {
            const cheapest = p.variants[0];
            const originalPrice = Number(cheapest?.price || 0);
            const salePrice = Number(cheapest?.salePrice || originalPrice);
            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              category: p.categoryId,
              categoryName: p.category.name,
              thumbnailUrl: p.thumbnailUrl,
              icon: p.category.icon || '🔑',
              price: originalPrice,
              salePrice: salePrice,
              discount: originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0,
              warrantyDays: p.warrantyDays,
              soldCount: 800,
              isFeatured: p.isFeatured,
              description: p.description || '',
              instructions: p.instructions || '',
              variants: p.variants.map((v) => ({
                id: v.id,
                label: v.label,
                durationDays: v.durationDays || 30,
                price: Number(v.price),
                salePrice: Number(v.salePrice || v.price),
              })),
            };
          });
          return NextResponse.json({ success: true, products: formatted });
        }
      } catch (dbErr) {
        console.warn('DB error reading products, using fallback:', dbErr);
      }
    }

    // Fallback to MOCK_PRODUCTS
    let products = [...MOCK_PRODUCTS];

    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }

    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Lỗi lấy sản phẩm' },
      { status: 500 }
    );
  }
}
