'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.98 }}
      className="group block bg-[#1e293b] border border-[#334155] hover:border-[#ee8722]/60 rounded-2xl overflow-hidden transition-colors shadow-lg hover:shadow-2xl hover:shadow-[#ee8722]/10 flex flex-col justify-between"
    >
      <Link href={href} className="block">
        {/* Visual Icon / Thumbnail */}
        <div className="relative bg-[#0f172a] aspect-[4/3] flex items-center justify-center overflow-hidden border-b border-slate-800">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-6xl select-none transform group-hover:scale-115 transition-transform duration-300">
              {icon ?? '📦'}
            </span>
          )}

          {/* Discount badge */}
          {discountPct && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-[#ee8722] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md">
              -{discountPct}%
            </span>
          )}

          {/* Featured badge */}
          {isFeatured && (
            <span className="absolute top-3 left-3 bg-[#ee8722]/20 text-[#ee8722] border border-[#ee8722]/40 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              🔥 Hot
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Name */}
            <h3
              className="font-bold text-[#f1f5f9] group-hover:text-[#ee8722] text-sm leading-snug mb-2 line-clamp-2 transition-colors"
              title={name}
            >
              {name}
            </h3>

            {/* Warranty badge */}
            {warrantyDays && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-0.5 rounded-md mb-3 font-medium">
                🛡️ Bảo hành {warrantyDays >= 365 ? `${warrantyDays / 365} năm` : `${warrantyDays} ngày`}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-2">
            <div className="flex items-baseline gap-2 mb-3">
              {salePrice ? (
                <>
                  <span className="text-lg font-black text-[#ee8722]">
                    {formatVND(salePrice)}
                  </span>
                  <span className="text-xs text-[#64748b] line-through">
                    {formatVND(price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-black text-[#ee8722]">
                  {formatVND(price)}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <div className="w-full bg-[#ee8722] group-hover:bg-[#f5a23f] text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors shadow-md shadow-[#ee8722]/20">
              Xem & Mua ngay →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
