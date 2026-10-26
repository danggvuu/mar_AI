'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Tất cả sản phẩm', href: '/san-pham' },
  { label: 'Tài khoản bản quyền', href: '/san-pham?category=tai-khoan-ban-quyen' },
  { label: 'Công cụ', href: '/san-pham?category=cong-cu' },
  { label: 'Khuyến mại', href: '/san-pham?category=khuyen-mai' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openAuth = (tab?: string) => {
    window.dispatchEvent(
      new CustomEvent('open-auth', { detail: { tab: tab ?? 'login' } })
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f172a]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-[#0f172a]'
      }`}
    >
      {/* Top bar */}
      <div className="border-b border-[#334155] bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-[#94a3b8]">
          <span>
            📞 Hotline:{' '}
            <a href="tel:0963973205" className="text-[#ee8722] hover:underline font-medium">
              0963 973 205
            </a>
          </span>
          <a
            href="#how-to-buy"
            className="hover:text-[#ee8722] transition-colors"
          >
            Hướng dẫn mua hàng →
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-bold text-[#ee8722]">AccStore</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xl hidden sm:flex relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-[#1e293b] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] rounded-lg px-4 py-2 text-sm outline-none focus:border-[#ee8722] transition-colors pr-10"
            />
            <button
              className="absolute right-0 top-0 h-full px-3 text-[#94a3b8] hover:text-[#ee8722] transition-colors"
              aria-label="Tìm kiếm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e293b] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            {/* Auth button */}
            <button
              onClick={() => openAuth('login')}
              className="flex items-center gap-2 bg-[#ee8722] hover:bg-[#f5a23f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-[#94a3b8] hover:text-[#f1f5f9] rounded-lg hover:bg-[#1e293b] transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden mt-2">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-[#1e293b] border border-[#334155] text-[#f1f5f9] placeholder-[#64748b] rounded-lg px-4 py-2 text-sm outline-none focus:border-[#ee8722] transition-colors pr-10"
            />
            <button className="absolute right-0 top-0 h-full px-3 text-[#94a3b8]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden mt-3 pb-2 border-t border-[#334155] pt-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e293b] transition-all text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
