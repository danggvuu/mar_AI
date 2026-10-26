import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tất cả sản phẩm', href: '/san-pham' },
  { label: 'Khuyến mại', href: '/san-pham?category=khuyen-mai' },
  { label: 'Hướng dẫn mua hàng', href: '#how-to-buy' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-[#334155] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold text-[#ee8722]">AccStore</span>
            </div>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              Mua acc bản quyền giá rẻ, uy tín. Giao hàng tự động ngay sau
              thanh toán.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://zalo.me/0963973205"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center text-sm font-bold text-[#00b2ff] hover:bg-[#253449] transition-colors border border-[#334155]"
                aria-label="Zalo"
              >
                Z
              </a>
              <a
                href="https://t.me/Danggvuu_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1e293b] flex items-center justify-center hover:bg-[#253449] transition-colors border border-[#334155]"
                aria-label="Telegram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#2AABEE"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[#f1f5f9] font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#94a3b8] hover:text-[#ee8722] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#f1f5f9] font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-[#94a3b8]">
                <span>📞</span>
                <a
                  href="tel:0963973205"
                  className="hover:text-[#ee8722] transition-colors"
                >
                  Hotline: 0963 973 205
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#94a3b8]">
                <span>💬</span>
                <a
                  href="https://zalo.me/0963973205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ee8722] transition-colors"
                >
                  Zalo: 0963 973 205
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#94a3b8]">
                <span>✈️</span>
                <a
                  href="https://t.me/Danggvuu_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ee8722] transition-colors"
                >
                  Telegram: @Danggvuu_bot
                </a>
              </li>
              <li className="flex items-start gap-2 text-[#94a3b8]">
                <span>⏰</span>
                <span>Hỗ trợ: 7:00 – 23:00 hàng ngày</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#334155] mt-10 pt-6 text-center text-[#64748b] text-sm">
          <p>© 2025 AccStore. Tất cả quyền được bảo lưu.</p>
          <p className="mt-1">
            Thiết kế với ❤️ tại Việt Nam — Chúng tôi không lưu thông tin thẻ
            ngân hàng.
          </p>
        </div>
      </div>
    </footer>
  );
}
