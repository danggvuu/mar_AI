'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '@/components/ProductCard';
import FlashSaleTimer from '@/components/FlashSaleTimer';
import AnimateBackground from '@/components/ui/animate-background';
import { MOCK_PRODUCTS, CATEGORIES, ProductItem } from '@/lib/products-data';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [productsList, setProductsList] = useState<ProductItem[]>(MOCK_PRODUCTS);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.products?.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const flashSaleProducts =
    productsList.filter((p) => p.isFeatured).length > 0
      ? productsList.filter((p) => p.isFeatured).slice(0, 4)
      : productsList.slice(0, 4);

  const displayedProducts =
    activeCategory === 'all'
      ? productsList
      : productsList.filter((p) => p.category === activeCategory);

  const faqs = [
    {
      q: 'Mua hàng ở đây có bắt buộc phải tạo tài khoản không?',
      a: 'Không bắt buộc! Bạn hoàn toàn có thể mua hàng dưới dạng khách (Guest). Chỉ cần bấm "Mua qua Telegram Bot" hoặc "Chat Zalo", hệ thống sẽ hỗ trợ chốt đơn và gửi tài khoản trực tiếp qua tin nhắn cho bạn.',
    },
    {
      q: 'Thời gian nhận tài khoản là bao lâu sau khi thanh toán?',
      a: 'Hệ thống Telegram Bot hoạt động tự động 24/7. Ngay sau khi chuyển khoản đúng mã đơn, Bot sẽ tự động nhả tài khoản (email | password | mã 2FA) trong vòng 30 giây đến 1 phút.',
    },
    {
      q: 'Chính sách bảo hành tài khoản hoạt động như thế nào?',
      a: 'Toàn bộ tài khoản bán ra đều được bảo hành 1-đổi-1 trọn thời gian sử dụng (từ 1 tháng đến 1 năm tùy gói). Nếu tài khoản lỗi hoặc mất quyền, bạn chỉ cần gửi mã đơn cho Bot hoặc Zalo 0963.973.205 để được cấp acc mới ngay.',
    },
    {
      q: 'Tôi có phải đưa mật khẩu tài khoản cá nhân cho shop không?',
      a: 'Tuyệt đối không! Với các gói cấp acc sẵn, shop giao trọn bộ tài khoản mới riêng biệt. Với các gói nâng cấp chính chủ (như Canva, YouTube, Duolingo), shop chỉ gửi link mời tham gia gia đình hoặc link kích hoạt, không bao giờ hỏi mật khẩu cá nhân của bạn.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] relative overflow-hidden">
      {/* Dynamic Motion Background */}
      <AnimateBackground />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e293b]/90 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-6 shadow-lg backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              Bản quyền chính chủ • Kích hoạt tự động 30s
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight"
            >
              Tài Khoản Bản Quyền <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ee8722] via-amber-400 to-orange-300">
                Giá Rẻ – Giao Tự Động
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Cung cấp CapCut Pro, Canva Pro, YouTube Premium, Gemini Advanced, ChatGPT Plus và hơn 40+ công cụ số uy tín. Chốt đơn tự động qua Telegram Bot & Zalo.
            </motion.p>

            {/* CTA Buttons with Spring Physics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/san-pham"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#ee8722] hover:bg-[#f5a23f] text-white font-bold text-sm shadow-xl shadow-[#ee8722]/25 transition-colors"
                >
                  🛒 Xem tất cả sản phẩm
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <a
                  href="https://t.me/Danggvuu_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bold text-sm shadow-xl shadow-[#2AABEE]/25 gap-2 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span>Mở Telegram Bot (@Danggvuu_bot)</span>
                </a>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <a
                  href="https://zalo.me/0963973205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 gap-2 transition-colors"
                >
                  <span>💬 Chat Zalo (0963.973.205)</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Trust Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">⚡</span>
                <span className="text-xs font-bold text-slate-200">Giao nhanh 30s</span>
                <span className="text-[11px] text-slate-400">Tự động qua bot 24/7</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">🛡️</span>
                <span className="text-xs font-bold text-slate-200">Bảo hành 1-đổi-1</span>
                <span className="text-[11px] text-slate-400">Trọn thời gian sử dụng</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">🔒</span>
                <span className="text-xs font-bold text-slate-200">Không cần pass gốc</span>
                <span className="text-[11px] text-slate-400">An toàn tuyệt đối</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">💳</span>
                <span className="text-xs font-bold text-slate-200">VietQR tiện lợi</span>
                <span className="text-[11px] text-slate-400">Quét mã chuyển khoản</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FLASH SALE SECTION */}
      <section className="py-12 bg-[#0c1322]/80 border-b border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-[#1e293b]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-orange-500/30 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">🔥</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>FLASH SALE GIỜ VÀNG</span>
                  <span className="text-xs font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">
                    Giảm tới 98%
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Số lượng ưu đãi có hạn trong khung giờ hôm nay
                </p>
              </div>
            </div>
            <FlashSaleTimer initialHours={6} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                category={p.category}
                thumbnailUrl={p.thumbnailUrl}
                icon={p.icon}
                price={p.price}
                salePrice={p.salePrice}
                warrantyDays={p.warrantyDays}
                isFeatured={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG WITH ANIMATED TABS */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Kho sản phẩm số
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Tài Khoản Bản Quyền Nổi Bật
              </h2>
            </div>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-[#ee8722] text-white shadow-md shadow-[#ee8722]/30 font-bold'
                      : 'bg-[#1e293b] text-slate-300 hover:bg-[#253449] border border-slate-700/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                category={p.category}
                thumbnailUrl={p.thumbnailUrl}
                icon={p.icon}
                price={p.price}
                salePrice={p.salePrice}
                warrantyDays={p.warrantyDays}
                isFeatured={p.isFeatured}
              />
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e293b] hover:bg-[#253449] border border-slate-700 text-sm font-bold text-white transition-all shadow-md hover:border-[#ee8722]/50"
            >
              <span>Xem toàn bộ danh mục sản phẩm</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (QUY TRÌNH 4 BƯỚC) */}
      <section className="py-16 bg-[#0c1322]/80 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Đơn giản & Tiện lợi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Quy Trình Mua Hàng 4 Bước
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Không cần đăng nhập rườm rà. Bạn chỉ cần chọn acc và nhận thông tin qua Bot.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 relative shadow-lg"
            >
              <span className="text-3xl font-black text-orange-400/20 absolute top-4 right-4">01</span>
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-base font-bold text-white mb-2">Chọn gói tài khoản</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Xem chi tiết tính năng, thời hạn (1 tháng, 6 tháng, 1 năm) và mức giá ưu đãi trên web.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 relative shadow-lg"
            >
              <span className="text-3xl font-black text-orange-400/20 absolute top-4 right-4">02</span>
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-base font-bold text-white mb-2">Mở Bot hoặc Zalo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bấm nút "Mua qua Telegram Bot" hoặc "Chat Zalo". Hệ thống tự sinh mã đơn hàng chuẩn.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 relative shadow-lg"
            >
              <span className="text-3xl font-black text-orange-400/20 absolute top-4 right-4">03</span>
              <div className="text-3xl mb-3">💳</div>
              <h3 className="text-base font-bold text-white mb-2">Quét mã VietQR</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chuyển khoản qua mã QR hiển thị trong tin nhắn với nội dung đã được điền tự động.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 relative shadow-lg"
            >
              <span className="text-3xl font-black text-orange-400/20 absolute top-4 right-4">04</span>
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-base font-bold text-white mb-2">Nhận acc trong 30s</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bot tự động gửi thông tin tài khoản (email | pass | 2FA) và hướng dẫn đăng nhập chi tiết.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION WITH ANIMATE-UI EXPAND/COLLAPSE */}
      <section className="py-16 border-t border-slate-800 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Giải đáp thắc mắc
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Câu Hỏi Thường Gặp
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#1e293b] rounded-2xl border border-slate-700/80 overflow-hidden transition-colors hover:border-slate-600 shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === idx ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-orange-400 text-xl font-bold shrink-0"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 pt-3.5 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
