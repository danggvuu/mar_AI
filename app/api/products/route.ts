import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/products-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

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
