'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  accountData?: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  telegramRef?: string;
  items: OrderItem[];
}

export default function UserAccountPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email: string; fullName?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  useEffect(() => {
    const t = localStorage.getItem('acc_token');
    setToken(t);
    if (!t) {
      setLoading(false);
      return;
    }

    // Fetch user & orders
    Promise.all([
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${t}` } }).then((r) => r.json()),
      fetch('/api/orders', { headers: { Authorization: `Bearer ${t}` } }).then((r) => r.json()),
    ])
      .then(([userData, orderData]) => {
        if (userData.user) setUser(userData.user);
        if (orderData.orders) setOrders(orderData.orders);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('acc_token');
    setToken(null);
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="animate-spin text-4xl text-[#ee8722]">⚡</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white py-16 px-4">
        <div className="max-w-md mx-auto bg-[#1e293b] p-8 rounded-2xl border border-slate-700/80 text-center shadow-xl">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-bold mb-2">Đăng Nhập Tài Khoản</h2>
          <p className="text-sm text-slate-400 mb-6">
            Đăng nhập để xem lịch sử các tài khoản đã mua, thông tin bảo hành và liên kết Telegram Bot.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: { tab: 'login' } }))}
              className="w-full bg-[#ee8722] hover:bg-[#f5a23f] text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#ee8722]/20"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: { tab: 'register' } }))}
              className="w-full bg-[#0f172a] hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold py-3 rounded-xl transition-all cursor-pointer"
            >
              Tạo tài khoản mới
            </button>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            Mua hàng không cần đăng nhập? Kiểm tra hòm thư email hoặc tin nhắn Telegram Bot!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Greeting */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ee8722] to-amber-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {user?.fullName || 'Khách hàng thân thiết'}
              </h1>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="https://t.me/Danggvuu_bot"
              target="_blank"
              className="bg-[#2AABEE] hover:bg-[#229ED9] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>🤖</span> Liên kết Telegram Bot
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#ee8722] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đơn hàng của tôi ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-[#ee8722] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Thông tin tài khoản
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-12 text-center">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="text-base font-bold text-slate-200">Chưa có đơn hàng nào</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Bạn chưa thực hiện giao dịch nào trên tài khoản này.
                </p>
                <Link
                  href="/san-pham"
                  className="bg-[#ee8722] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#f5a23f] transition-all"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-5 shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        Mã đơn: #{ord.telegramRef || ord.id}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          ord.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : ord.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        {ord.status === 'PAID'
                          ? 'Đã giao hàng'
                          : ord.status === 'PENDING'
                          ? 'Đang kiểm tra'
                          : 'Chờ thanh toán'}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {ord.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-slate-200 font-medium">
                          {it.name || 'Tài khoản bản quyền'} x {it.quantity || 1}
                        </span>
                        <span className="text-orange-400 font-bold">
                          {formatVND(it.unitPrice || ord.total)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Account Data if Delivered */}
                  {ord.status === 'PAID' && (
                    <div className="bg-[#0f172a] rounded-xl p-3.5 border border-emerald-500/30">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          ✓ Thông tin tài khoản được bàn giao:
                        </span>
                        <button
                          onClick={() => handleCopy(ord.items?.[0]?.accountData || 'email@example.com | Pass123 | 2FA_KEY', ord.id)}
                          className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                        >
                          {copiedIndex === ord.id ? '✓ Đã chép' : 'Sao chép'}
                        </button>
                      </div>
                      <code className="text-xs font-mono text-slate-300 break-all select-all">
                        {ord.items?.[0]?.accountData || 'email@example.com | Pass123 | 2FA_KEY'}
                      </code>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 max-w-xl">
            <h3 className="text-base font-bold text-white mb-4">Thông tin cá nhân</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Họ và tên</label>
                <div className="p-2.5 bg-[#0f172a] rounded-lg border border-slate-700 text-white font-medium">
                  {user?.fullName || 'Chưa cập nhật'}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <div className="p-2.5 bg-[#0f172a] rounded-lg border border-slate-700 text-white font-medium">
                  {user?.email}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Cần đổi mật khẩu hoặc cập nhật email?</span>
                <Link
                  href="https://zalo.me/0963973205"
                  target="_blank"
                  className="text-xs text-[#ee8722] hover:underline"
                >
                  Liên hệ Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
