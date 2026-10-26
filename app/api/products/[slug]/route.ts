import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/products-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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
