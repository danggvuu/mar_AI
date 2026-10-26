import Link from 'next/link';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  thumbnailUrl?: string;
  icon?: string;
  price: number;
  salePrice?: number;
  warrantyDays?: number;
  isFeatured?: boolean;
  variants?: Array<{ label: string; salePrice: number }>;
}

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function ProductCard({
  name,
  slug,
  category,
  thumbnailUrl,
  icon,
  price,
  salePrice,
  warrantyDays,
  isFeatured,
}: ProductCardProps) {
  const discountPct =
    salePrice && price > salePrice
      ? Math.round(((price - salePrice) / price) * 100)
      : null;

  const href = `/${category}/${slug}`;

  return (
    <Link
      href={href}
      className="group block bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#475569] hover:shadow-xl hover:shadow-black/30"
    >
      {/* Thumbnail */}
      <div className="relative bg-[#0f172a] aspect-[4/3] flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-6xl select-none">{icon ?? '📦'}</span>
        )}

        {/* Discount badge */}
        {discountPct && (
          <span className="absolute top-2 right-2 bg-[#ee8722] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}

        {/* Featured badge */}
        {isFeatured && (
          <span className="absolute top-2 left-2 bg-[#ef4444] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            🔥 Hot
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Name */}
        <h3
          className="font-semibold text-[#f1f5f9] text-sm leading-snug mb-2 line-clamp-2"
          title={name}
        >
          {name}
        </h3>

        {/* Warranty */}
        {warrantyDays && (
          <span className="inline-flex items-center gap-1 text-xs text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-0.5 rounded-full mb-3">
            🛡️ Bảo hành {warrantyDays >= 365 ? `${warrantyDays / 365} năm` : `${warrantyDays} ngày`}
          </span>
        )}

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          {salePrice ? (
            <>
              <span className="text-lg font-bold text-[#ee8722]">
                {formatVND(salePrice)}
              </span>
              <span className="text-xs text-[#64748b] line-through">
                {formatVND(price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-[#ee8722]">
              {formatVND(price)}
            </span>
          )}
        </div>

        {/* CTA */}
        <button className="w-full bg-[#ee8722] hover:bg-[#f5a23f] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
          Mua ngay
        </button>
      </div>
    </Link>
  );
}
