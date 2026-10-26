import ProductDetailClient from './ProductDetailClient';
import { MOCK_PRODUCTS } from '@/lib/products-data';

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolved = await params;
  return <ProductDetailClient category={resolved.category} slug={resolved.slug} />;
}
