'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, MOCK_PRODUCTS } from '@/lib/products-data';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchCat =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tất Cả Sản Phẩm
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Khám phá hơn 40+ tài khoản số bản quyền giá rẻ, bảo hành uy tín và kích hoạt nhanh chóng.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 pb-6 border-b border-slate-800">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#ee8722] text-white shadow-lg shadow-[#ee8722]/20 font-semibold'
                    : 'bg-[#1e293b] text-slate-300 hover:bg-[#253449] border border-slate-700/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#ee8722] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                category={p.category}
                icon={p.icon}
                price={p.price}
                salePrice={p.salePrice}
                warrantyDays={p.warrantyDays}
                isFeatured={p.isFeatured}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-slate-800">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-slate-200">Không tìm thấy sản phẩm nào</h3>
            <p className="text-sm text-slate-400 mt-1">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc danh mục.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#ee8722] text-white text-sm font-semibold rounded-lg hover:bg-[#f5a23f] transition-all"
            >
              Xem tất cả
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
