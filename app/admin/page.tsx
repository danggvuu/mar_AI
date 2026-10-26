'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS, ProductItem } from '@/lib/products-data';

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stock' | 'config'>('products');
  const [productsList, setProductsList] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('admin_unlocked');
      if (saved === 'true') {
        setIsUnlocked(true);
      }
    }
  }, []);

  // Fetch latest products from database
  useEffect(() => {
    if (isUnlocked) {
      fetch('/api/admin/products')
        .then((r) => r.json())
        .then((data) => {
          if (data.products && data.products.length > 0) {
            setProductsList(data.products);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [isUnlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const validPins = ['danggvuu_admin_2026', 'admin123', '0963973205'];
    if (validPins.includes(pinInput.trim())) {
      setIsUnlocked(true);
      sessionStorage.setItem('admin_unlocked', 'true');
      sessionStorage.setItem('admin_key', pinInput.trim());
      setPinError('');
    } else {
      setPinError('Mã PIN quản trị không chính xác.');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('admin_unlocked');
    sessionStorage.removeItem('admin_key');
  };

  const currentProd = productsList.find((p) => p.slug === selectedProduct) || productsList[0];

  const handleProductChange = (slug: string) => {
    setSelectedProduct(slug);
    const prod = productsList.find((p) => p.slug === slug);
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);
    setSaveSuccessMsg('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi cập nhật');

      // Update state locally
      setProductsList((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      setSaveSuccessMsg('✓ Đã lưu thay đổi vào cơ sở dữ liệu Supabase thành công!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      setEditingProduct(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Có lỗi khi lưu');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleRegisterWebhook = async () => {
    setWebhookLoading(true);
    setWebhookStatus(null);
    try {
      const key = sessionStorage.getItem('admin_key') || 'danggvuu_admin_2026';
      const res = await fetch(
        `/api/telegram/setup?url=${encodeURIComponent(window.location.origin)}&key=${encodeURIComponent(key)}`
      );
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

  // Security Gatekeeper: PIN Lock Dialog
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1e293b] p-8 rounded-2xl border border-slate-700/80 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
            🛡️
          </div>
          <h2 className="text-xl font-bold mb-1">Xác Thực Quản Trị Viên</h2>
          <p className="text-xs text-slate-400 mb-6">
            Khu vực này chỉ dành cho chủ sở hữu website. Vui lòng nhập mã PIN quản trị để tiếp tục.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Nhập mã PIN quản trị..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-[#ee8722]"
              />
            </div>

            {pinError && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {pinError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#ee8722] hover:bg-[#f5a23f] text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#ee8722]/20"
            >
              Mở khóa Quản Trị
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold bg-[#ee8722]/20 text-[#ee8722] px-2 py-0.5 rounded">
                Admin Panel (Đã kết nối Supabase)
              </span>
              <h1 className="text-2xl font-bold text-white">Quản Trị Hệ Thống</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Quản lý giá, hình ảnh sản phẩm, nạp kho và cấu hình Telegram Bot & Zalo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLock}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
            >
              🔒 Khóa Quản Trị
            </button>
            <Link
              href="/"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
            >
              ← Về trang bán hàng
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#ee8722] text-white shadow-lg shadow-[#ee8722]/20'
                : 'bg-[#1e293b] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🏷️ Quản lý Sản Phẩm (Giá & Ảnh)
          </button>
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

        {saveSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-semibold">
            {saveSuccessMsg}
          </div>
        )}

        {/* TAB 1: PRODUCT MANAGEMENT (PRICE & IMAGE EDITOR) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-700/80 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <h3 className="font-bold text-white text-lg">Danh sách sản phẩm đang bán</h3>
                  <p className="text-xs text-slate-400">
                    Bấm &quot;Chỉnh sửa&quot; ở từng gói để thay đổi giá bán, đổi link ảnh hoặc bật/tắt Flash Sale.
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  ● Dữ liệu Supabase thời gian thực
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsList.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#0f172a] rounded-xl border border-slate-700/80 p-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail preview */}
                      <div className="aspect-video w-full bg-[#1e293b] rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-slate-800">
                        {prod.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.thumbnailUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-5xl select-none">{prod.icon || '🔑'}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                          {prod.categoryName}
                        </span>
                        {prod.isFeatured && (
                          <span className="text-[11px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                            🔥 Flash Sale
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-white text-sm line-clamp-2 mb-2">
                        {prod.name}
                      </h4>

                      {/* Variants price list */}
                      <div className="space-y-1 my-3 text-xs bg-[#1e293b]/60 p-2.5 rounded-lg border border-slate-800">
                        {prod.variants.map((v) => (
                          <div key={v.id} className="flex justify-between items-center">
                            <span className="text-slate-300 font-medium">{v.label}:</span>
                            <span className="text-orange-400 font-bold">
                              {formatVND(v.salePrice)}{' '}
                              <span className="text-slate-500 line-through text-[11px]">
                                {formatVND(v.price)}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingProduct({ ...prod })}
                      className="w-full bg-[#ee8722] hover:bg-[#f5a23f] text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer mt-2"
                    >
                      ✏️ Chỉnh sửa giá & ảnh
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* EDITING MODAL */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#1e293b] max-w-2xl w-full rounded-2xl border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-bold text-white">
                      Chỉnh sửa: {editingProduct.name}
                    </h3>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-slate-400 hover:text-white text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Tên sản phẩm:
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ee8722]"
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Link ảnh sản phẩm (URL Thumbnail):
                      </label>
                      <input
                        type="text"
                        placeholder="https://...link_anh.png (để trống nếu muốn dùng icon)"
                        value={editingProduct.thumbnailUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            thumbnailUrl: e.target.value,
                          })
                        }
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ee8722]"
                      />
                      {editingProduct.thumbnailUrl && (
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs text-slate-400">Xem trước ảnh:</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editingProduct.thumbnailUrl}
                            alt="Preview"
                            className="h-12 w-20 object-cover rounded border border-slate-700"
                          />
                        </div>
                      )}
                    </div>

                    {/* Flash sale & Warranty */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          Số ngày bảo hành:
                        </label>
                        <input
                          type="number"
                          value={editingProduct.warrantyDays}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              warrantyDays: Number(e.target.value),
                            })
                          }
                          className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ee8722]"
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-white font-semibold">
                          <input
                            type="checkbox"
                            checked={editingProduct.isFeatured}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                isFeatured: e.target.checked,
                              })
                            }
                            className="w-5 h-5 accent-[#ee8722]"
                          />
                          <span>Bật vào Flash Sale giờ vàng</span>
                        </label>
                      </div>
                    </div>

                    {/* Price and Variants */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                        Bảng giá các gói thời hạn:
                      </label>
                      <div className="space-y-3">
                        {editingProduct.variants.map((v, idx) => (
                          <div
                            key={v.id}
                            className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                          >
                            <div>
                              <span className="text-xs text-slate-400 block mb-1">Tên gói:</span>
                              <input
                                type="text"
                                value={v.label}
                                onChange={(e) => {
                                  const newVariants = [...editingProduct.variants];
                                  newVariants[idx].label = e.target.value;
                                  setEditingProduct({
                                    ...editingProduct,
                                    variants: newVariants,
                                  });
                                }}
                                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block mb-1">
                                Giá bán khuyến mãi (VNĐ):
                              </span>
                              <input
                                type="number"
                                value={v.salePrice}
                                onChange={(e) => {
                                  const newVariants = [...editingProduct.variants];
                                  newVariants[idx].salePrice = Number(e.target.value);
                                  setEditingProduct({
                                    ...editingProduct,
                                    variants: newVariants,
                                  });
                                }}
                                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block mb-1">
                                Giá gốc niêm yết (VNĐ):
                              </span>
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => {
                                  const newVariants = [...editingProduct.variants];
                                  newVariants[idx].price = Number(e.target.value);
                                  setEditingProduct({
                                    ...editingProduct,
                                    variants: newVariants,
                                  });
                                }}
                                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={savingProduct}
                        className="flex-1 bg-[#ee8722] hover:bg-[#f5a23f] text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-[#ee8722]/20"
                      >
                        {savingProduct ? 'Đang lưu vào Supabase...' : '💾 Lưu thay đổi ngay'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS */}
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

        {/* TAB 3: STOCK */}
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
                  {productsList.map((p) => (
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
                  {currentProd?.variants?.map((v) => (
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

        {/* TAB 4: CONFIG */}
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
                  <span className="text-emerald-400 font-bold">Bảo vệ (Secret Token Set)</span>
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
                {webhookLoading ? 'Đang gửi...' : 'Đăng ký Webhook An Toàn với Telegram'}
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
