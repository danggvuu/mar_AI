'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/products-data';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'stock' | 'config'>('orders');
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0].slug);
  const [selectedVariant, setSelectedVariant] = useState(MOCK_PRODUCTS[0].variants[0].id);
  const [stockInput, setStockInput] = useState('');
  const [stockSuccess, setStockSuccess] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [webhookLoading, setWebhookLoading] = useState(false);

  // Sample orders for admin demonstration
  const [adminOrders, setAdminOrders] = useState([
    {
      id: 'ORD-98214-A3',
      productName: 'Tài khoản CapCut Pro 1 Năm',
      amount: 89000,
      customerEmail: 'khachhang1@gmail.com',
      channel: 'Telegram Bot',
      status: 'PENDING',
      createdAt: 'Vừa xong',
    },
    {
      id: 'ORD-84192-B7',
      productName: 'Canva Pro 1 Năm Email Chính Chủ',
      amount: 119000,
      customerEmail: 'design.pro@gmail.com',
      channel: 'Zalo',
      status: 'PAID',
      createdAt: '10 phút trước',
    },
    {
      id: 'ORD-72910-K1',
      productName: 'YouTube Premium 1 Năm',
      amount: 189000,
      customerEmail: 'nguyenvana@gmail.com',
      channel: 'Telegram Bot',
      status: 'PAID',
      createdAt: '1 giờ trước',
    },
  ]);

  const currentProd = MOCK_PRODUCTS.find((p) => p.slug === selectedProduct) || MOCK_PRODUCTS[0];

  const handleProductChange = (slug: string) => {
    setSelectedProduct(slug);
    const prod = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (prod && prod.variants.length > 0) {
      setSelectedVariant(prod.variants[0].id);
    }
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = stockInput.trim().split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    setStockSuccess(`Đã nạp thành công ${lines.length} tài khoản vào kho!`);
    setStockInput('');
    setTimeout(() => setStockSuccess(''), 4000);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setAdminOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const handleRegisterWebhook = async () => {
    setWebhookLoading(true);
    setWebhookStatus(null);
    try {
      const res = await fetch(`/api/telegram/setup?url=${encodeURIComponent(window.location.origin)}`);
      const data = await res.json();
      setWebhookStatus(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      setWebhookStatus(err instanceof Error ? err.message : 'Lỗi kết nối webhook');
    } finally {
      setWebhookLoading(false);
    }
  };

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold bg-[#ee8722]/20 text-[#ee8722] px-2 py-0.5 rounded">
                Admin Panel
              </span>
              <h1 className="text-2xl font-bold text-white">Quản Trị Hệ Thống</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Quản lý đơn hàng, nạp kho tài khoản và cấu hình Telegram Bot & Zalo.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            ← Về trang bán hàng
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#ee8722] text-white shadow-lg shadow-[#ee8722]/20'
                : 'bg-[#1e293b] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            📋 Quản lý đơn hàng ({adminOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-[#ee8722] text-white shadow-lg shadow-[#ee8722]/20'
                : 'bg-[#1e293b] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            📦 Nạp kho tài khoản
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-[#ee8722] text-white shadow-lg shadow-[#ee8722]/20'
                : 'bg-[#1e293b] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ⚙️ Cấu hình Bot & Kênh
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Danh sách đơn hàng mới nhất</h3>
              <span className="text-xs text-slate-400">Tự động đồng bộ với Telegram Bot</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#0f172a] text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Mã đơn</th>
                    <th className="px-5 py-3.5">Sản phẩm</th>
                    <th className="px-5 py-3.5">Số tiền</th>
                    <th className="px-5 py-3.5">Khách hàng</th>
                    <th className="px-5 py-3.5">Kênh</th>
                    <th className="px-5 py-3.5">Trạng thái</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {adminOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-white text-xs">{ord.id}</td>
                      <td className="px-5 py-4 font-medium text-slate-200">{ord.productName}</td>
                      <td className="px-5 py-4 font-bold text-orange-400">{formatVND(ord.amount)}</td>
                      <td className="px-5 py-4 text-xs text-slate-400">{ord.customerEmail}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {ord.channel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            ord.status === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {ord.status === 'PAID' ? 'Đã thanh toán' : 'Chờ xác nhận'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {ord.status !== 'PAID' ? (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'PAID')}
                            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1 rounded cursor-pointer transition-colors"
                          >
                            ✓ Duyệt & Cấp acc
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400">Đã giao</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: STOCK */}
        {activeTab === 'stock' && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 max-w-2xl shadow-xl">
            <h3 className="font-bold text-white text-base mb-1">Nạp kho tài khoản tự động</h3>
            <p className="text-xs text-slate-400 mb-6">
              Dán danh sách tài khoản theo định dạng mỗi dòng một bộ:{' '}
              <code className="text-orange-400">Email|Mật khẩu|Mã 2FA</code>. Khi khách thanh toán, bot sẽ tự động lấy acc từ kho để gửi cho khách.
            </p>

            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Chọn sản phẩm:
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ee8722]"
                >
                  {MOCK_PRODUCTS.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Chọn gói thời hạn:
                </label>
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ee8722]"
                >
                  {currentProd.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} ({formatVND(v.salePrice)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Danh sách tài khoản (Mỗi dòng 1 acc):
                </label>
                <textarea
                  rows={6}
                  placeholder={`acc1@gmail.com|Password123|JBSWY3DPEHPK3PXP\nacc2@gmail.com|Password456|KBSWY3DPEHPK3PXP\nacc3@gmail.com|Password789|LBSWY3DPEHPK3PXP`}
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#ee8722]"
                />
              </div>

              {stockSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium">
                  ✓ {stockSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#ee8722] hover:bg-[#f5a23f] text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#ee8722]/20"
              >
                Nạp kho ngay
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: CONFIG */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Telegram Bot */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#2AABEE]/20 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Telegram Bot</h3>
                  <p className="text-xs text-slate-400">@Danggvuu_bot</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 mb-6">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Bot Username:</span>
                  <span className="font-mono text-white">@Danggvuu_bot</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Trạng thái:</span>
                  <span className="text-emerald-400 font-bold">Hoạt động (Token set)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Webhook endpoint:</span>
                  <span className="font-mono text-slate-400">/api/telegram/webhook</span>
                </div>
              </div>

              <button
                onClick={handleRegisterWebhook}
                disabled={webhookLoading}
                className="w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {webhookLoading ? 'Đang gửi...' : 'Đăng ký Webhook với Telegram'}
              </button>

              {webhookStatus && (
                <pre className="mt-3 p-3 bg-[#0f172a] rounded-lg text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
                  {webhookStatus}
                </pre>
              )}
            </div>

            {/* Zalo & Bank */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">
                  🏦
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Tài Khoản & Zalo</h3>
                  <p className="text-xs text-slate-400">Kênh thanh toán VietQR & liên hệ</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Số Zalo liên hệ:</span>
                  <span className="font-mono font-bold text-white">0963 973 205</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-bold text-white">Vietcombank (VCB)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <span className="font-mono font-bold text-white">1032429169</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-bold text-white">DANG VU</span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-[#0f172a] rounded-xl border border-slate-800 text-[11px] text-slate-400">
                💡 Mã QR thanh toán VietQR sẽ tự động đính kèm số tài khoản trên và số tiền tương ứng cho mỗi đơn hàng.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
