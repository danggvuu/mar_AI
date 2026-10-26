'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS, ProductItem } from '@/lib/products-data';

export default function ProductDetailClient({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) {
  const initialProduct = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
  const [product, setProduct] = useState<ProductItem>(initialProduct);

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || {
      id: 'default',
      label: 'Mặc định',
      durationDays: product.warrantyDays,
      price: product.price,
      salePrice: product.salePrice,
    }
  );

  const [buyerEmail, setBuyerEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'desc' | 'instructions' | 'warranty'>('desc');
  const [loadingAction, setLoadingAction] = useState<'tele' | 'zalo' | null>(null);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.product) {
          setProduct(data.product);
          if (data.product.variants?.length > 0) {
            setSelectedVariant((prev) => {
              const matched = data.product.variants.find((v: { id: string }) => v.id === prev.id);
              return matched || data.product.variants[0];
            });
          }
        }
      })
      .catch((err) => console.error(err));
  }, [slug]);

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleOrder = async (target: 'tele' | 'zalo') => {
    setLoadingAction(target);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('acc_token') : null;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: [{ variantId: selectedVariant.id, quantity: 1 }],
          guestEmail: buyerEmail || 'guest@example.com',
          productName: product.name,
          variantLabel: selectedVariant.label,
          amount: selectedVariant.salePrice,
        }),
      });

      const data = await res.json();
      if (target === 'tele') {
        const link = data.deepLink || 'https://t.me/Danggvuu_bot';
        window.open(link, '_blank');
      } else {
        const link = data.zaloLink || 'https://zalo.me/0963973205';
        window.open(link, '_blank');
      }
    } catch (err) {
      console.error(err);
      if (target === 'tele') {
        window.open('https://t.me/Danggvuu_bot', '_blank');
      } else {
        window.open('https://zalo.me/0963973205', '_blank');
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const discountPercent = Math.round(
    ((selectedVariant.price - selectedVariant.salePrice) / selectedVariant.price) * 100
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-white">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/san-pham" className="hover:text-white">
            Sản phẩm
          </Link>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Visual Icon / Thumbnail */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square max-w-md bg-[#1e293b] rounded-2xl border border-slate-700/80 flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-2xl">
              {product.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.thumbnailUrl}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl p-2 hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
                  {product.icon || '🔑'}
                </div>
              )}
              <div className="absolute top-4 left-4 bg-orange-500/20 text-orange-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-500/30 backdrop-blur-md">
                ⚡ Kích hoạt trong 30s
              </div>
              <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
                🛡️ Bảo hành {product.warrantyDays} ngày
              </div>
              <div className="text-xs text-slate-400 mt-2 text-center">
                Cam kết tài khoản bản quyền chính chủ, ổn định
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="w-full max-w-md grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#1e293b]/70 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                <span className="text-xl">🚀</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">Giao tự động</div>
                  <div className="text-[11px] text-slate-400">Nhận acc qua bot 24/7</div>
                </div>
              </div>
              <div className="bg-[#1e293b]/70 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                <span className="text-xl">🔄</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">Đổi trả 1-1</div>
                  <div className="text-[11px] text-slate-400">Bảo hành trọn thời hạn</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Purchase Flow */}
          <div className="lg:col-span-7 bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                  {product.categoryName}
                </span>
                <span className="text-xs text-slate-400">Đã bán {product.soldCount}+</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                {product.name}
              </h1>

              {/* Price display */}
              <div className="flex items-baseline gap-3 my-5 p-4 bg-[#0f172a] rounded-xl border border-slate-800">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#ee8722]">
                  {formatVND(selectedVariant.salePrice)}
                </div>
                {selectedVariant.price > selectedVariant.salePrice && (
                  <>
                    <div className="text-sm text-slate-500 line-through">
                      {formatVND(selectedVariant.price)}
                    </div>
                    <div className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded">
                      -{discountPercent}%
                    </div>
                  </>
                )}
              </div>

              {/* Variant Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Chọn gói thời hạn:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        selectedVariant.id === v.id
                          ? 'border-[#ee8722] bg-[#ee8722]/10 shadow-md'
                          : 'border-slate-700 bg-[#0f172a]/60 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex justify-between items-center">
                        <span>{v.label}</span>
                        {selectedVariant.id === v.id && (
                          <span className="text-[#ee8722]">✓</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-orange-400 mt-1">
                        {formatVND(v.salePrice)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Email Field */}
              <div className="mb-6 p-4 bg-[#0f172a]/70 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Email nhận tài khoản (Không cần đăng nhập):
                  </label>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    ✓ Mua ngay không cần tài khoản
                  </span>
                </div>
                <input
                  type="email"
                  placeholder="Nhập email của bạn (ví dụ: yourname@gmail.com)..."
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ee8722] transition-colors"
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleOrder('tele')}
                className="flex-1 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-[#2AABEE]/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <span>{loadingAction === 'tele' ? 'Đang mở Bot...' : 'Mua qua Telegram Bot (Cấp 30s)'}</span>
              </button>

              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleOrder('zalo')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <span className="font-extrabold text-lg">Z</span>
                <span>{loadingAction === 'zalo' ? 'Đang mở Zalo...' : 'Chat Zalo Chốt Đơn (0963.973.205)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Details Section */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 sm:p-8 mb-12 shadow-xl">
          <div className="flex gap-2 border-b border-slate-800 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'desc'
                  ? 'bg-[#ee8722] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mô tả chi tiết
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'instructions'
                  ? 'bg-[#ee8722] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hướng dẫn kích hoạt
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'warranty'
                  ? 'bg-[#ee8722] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chính sách bảo hành
            </button>
          </div>

          <div className="text-sm text-slate-300 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <h4 className="font-bold text-white text-base mt-4">Điểm nổi bật:</h4>
                <ul className="list-disc pl-5 space-y-2 text-slate-300">
                  <li>Tài khoản kích hoạt chính chủ hoặc cấp sẵn dùng riêng ổn định.</li>
                  <li>Sử dụng đầy đủ mọi tính năng VIP/Pro của phần mềm.</li>
                  <li>Hỗ trợ đa nền tảng (Windows, macOS, iOS, Android).</li>
                  <li>Tiết kiệm tới 80% - 95% chi phí so với mua trực tiếp từ hãng.</li>
                </ul>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-3 whitespace-pre-line">
                <div className="p-4 bg-[#0f172a] rounded-xl border border-slate-800 text-slate-200">
                  {product.instructions}
                </div>
                <p className="text-xs text-slate-400 italic">
                  * Sau khi thanh toán, mã đơn hàng và hướng dẫn chi tiết cũng sẽ được bot gửi trực tiếp qua tin nhắn.
                </p>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-base">Cam kết bảo hành uy tín:</h4>
                <ul className="list-disc pl-5 space-y-2 text-slate-300">
                  <li>Bảo hành toàn bộ thời gian sử dụng: <strong>{product.warrantyDays} ngày</strong>.</li>
                  <li>Nếu tài khoản gặp sự cố (mất quyền, đổi pass), cam kết khắc phục hoặc đổi tài khoản mới trong vòng 15 - 30 phút.</li>
                  <li>Hoàn tiền 100% nếu không thể bảo hành hoặc xử lý lỗi trong 24 giờ.</li>
                  <li>Bộ phận hỗ trợ kỹ thuật trực 24/7 qua Zalo <strong>0963.973.205</strong> và Telegram <strong>@Danggvuu_bot</strong>.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.filter((p) => p.slug !== product.slug)
              .slice(0, 4)
              .map((p) => (
                <div
                  key={p.id}
                  className="bg-[#1e293b] rounded-xl border border-slate-700/80 p-4 flex flex-col justify-between hover:border-[#ee8722]/60 transition-all hover:-translate-y-1"
                >
                  <div>
                    <div className="text-3xl mb-2">{p.icon}</div>
                    <Link
                      href={`/${p.category}/${p.slug}`}
                      className="text-sm font-bold text-white hover:text-[#ee8722] line-clamp-2"
                    >
                      {p.name}
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#ee8722]">
                      {formatVND(p.salePrice)}
                    </span>
                    <Link
                      href={`/${p.category}/${p.slug}`}
                      className="text-xs bg-[#0f172a] hover:bg-[#ee8722] hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 font-medium transition-colors"
                    >
                      Xem ngay
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
