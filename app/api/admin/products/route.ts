import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_PRODUCTS } from '@/lib/products-data';

export async function GET() {
  try {
    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      const dbProducts = await prisma.product.findMany({
        include: {
          variants: { orderBy: { sortOrder: 'asc' } },
          category: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      if (dbProducts.length > 0) {
        const formatted = dbProducts.map((p) => {
          const cheapest = p.variants[0];
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.categoryId,
            categoryName: p.category.name,
            thumbnailUrl: p.thumbnailUrl,
            warrantyDays: p.warrantyDays,
            isFeatured: p.isFeatured,
            description: p.description || '',
            instructions: p.instructions || '',
            price: Number(cheapest?.price || 0),
            salePrice: Number(cheapest?.salePrice || cheapest?.price || 0),
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
    }

    return NextResponse.json({ success: true, products: MOCK_PRODUCTS });
  } catch (err: unknown) {
    console.error('Error fetching admin products:', err);
    return NextResponse.json({ success: true, products: MOCK_PRODUCTS });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, slug, name, thumbnailUrl, warrantyDays, isFeatured, variants } = body;

    const isDbConfigured =
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes('USER:PASSWORD');

    if (isDbConfigured) {
      // Update in Supabase Database
      const updatedProduct = await prisma.product.update({
        where: slug ? { slug } : { id },
        data: {
          name: name ? String(name).trim() : undefined,
          thumbnailUrl: thumbnailUrl !== undefined ? (thumbnailUrl ? String(thumbnailUrl).trim() : null) : undefined,
          warrantyDays: warrantyDays !== undefined ? Number(warrantyDays) : undefined,
          isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        },
      });

      // Update variants if provided
      if (Array.isArray(variants)) {
        for (const v of variants) {
          if (v.id) {
            await prisma.variant.update({
              where: { id: v.id },
              data: {
                label: v.label ? String(v.label).trim() : undefined,
                price: v.price !== undefined ? Number(v.price) : undefined,
                salePrice: v.salePrice !== undefined ? Number(v.salePrice) : undefined,
              },
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Đã cập nhật sản phẩm thành công vào cơ sở dữ liệu Supabase!',
        product: updatedProduct,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Đã cập nhật (chế độ demo)!',
    });
  } catch (err: unknown) {
    console.error('Error updating product:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi cập nhật sản phẩm' },
      { status: 500 }
    );
  }
}
