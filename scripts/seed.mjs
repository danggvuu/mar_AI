import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  console.error('Lỗi: DATABASE_URL chưa được thiết lập trong biến môi trường!');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const CATEGORIES = [
  { id: 'tai-khoan-ban-quyen', name: 'Tài Khoản Bản Quyền', slug: 'tai-khoan-ban-quyen', icon: '🔑' },
  { id: 'tk-ai', name: 'AI & Làm Việc', slug: 'tk-ai', icon: '🤖' },
  { id: 'tk-thiet-ke', name: 'Thiết Kế & Đồ Họa', slug: 'tk-thiet-ke', icon: '🎨' },
  { id: 'tk-giai-tri', name: 'Giải Trí & Phim Ảnh', slug: 'tk-giai-tri', icon: '🎬' },
  { id: 'tk-hoc-tap', name: 'Học Tập', slug: 'tk-hoc-tap', icon: '🎓' },
];

const PRODUCTS = [
  {
    id: '1',
    name: 'Tài khoản CapCut Pro 1 Năm – Kích hoạt chính chủ',
    slug: 'capcut-pro-1-nam',
    categoryId: 'tk-thiet-ke',
    thumbnailUrl: null,
    warrantyDays: 365,
    isFeatured: true,
    description: 'CapCut Pro bản quyền đầy đủ tính năng: Xuất video 4K 60fps, xóa phông nền AI, kho hiệu ứng và âm thanh VIP không giới hạn trên PC và Mobile.',
    instructions: '1. Đăng nhập vào app CapCut trên điện thoại hoặc PC.\n2. Nhập thông tin tài khoản được cấp hoặc nhận liên kết mời tham gia nhóm bản quyền.\n3. Sử dụng ngay mọi tính năng Pro không giới hạn.',
    variants: [
      { id: 'v1-1', label: '1 Tháng', durationDays: 30, price: 90000, salePrice: 29000 },
      { id: 'v1-2', label: '6 Tháng', durationDays: 180, price: 350000, salePrice: 59000 },
      { id: 'v1-3', label: '1 Năm (Khuyên dùng)', durationDays: 365, price: 650000, salePrice: 89000 },
    ],
  },
  {
    id: '2',
    name: 'Canva Pro Nâng Cấp Email Chính Chủ 1 Năm',
    slug: 'canva-pro-1-nam',
    categoryId: 'tk-thiet-ke',
    thumbnailUrl: null,
    warrantyDays: 365,
    isFeatured: true,
    description: 'Nâng cấp Canva Pro trực tiếp trên email cá nhân của bạn. Dung lượng lưu trữ 1TB Cloud, hơn 100 triệu ảnh/video premium, công cụ xóa phông ma thuật Magic Studio.',
    instructions: '1. Cung cấp email tài khoản Canva của bạn khi đặt hàng.\n2. Kiểm tra hòm thư và nhấn "Tham gia nhóm" từ lời mời của Canva.\n3. Tài khoản được nâng cấp Pro ngay lập tức, giữ nguyên toàn bộ thiết kế cũ.',
    variants: [
      { id: 'v2-1', label: '6 Tháng', durationDays: 180, price: 600000, salePrice: 69000 },
      { id: 'v2-2', label: '1 Năm', durationDays: 365, price: 1200000, salePrice: 119000 },
      { id: 'v2-3', label: 'Vĩnh Viễn (Lifetime)', durationDays: 1825, price: 2500000, salePrice: 249000 },
    ],
  },
  {
    id: '3',
    name: 'YouTube Premium 1 Năm – Nghe nhạc tắt màn hình & Không quảng cáo',
    slug: 'youtube-premium-1-nam',
    categoryId: 'tk-giai-tri',
    thumbnailUrl: null,
    warrantyDays: 365,
    isFeatured: true,
    description: 'Xem video không lo quảng cáo phiền toái, phát trong nền khi tắt màn hình hoặc chuyển ứng dụng, kèm miễn phí gói YouTube Music Premium chất lượng cao.',
    instructions: '1. Nhập email Google của bạn khi đặt hàng.\n2. Mở email xác nhận lời mời vào gia đình Google Family.\n3. Tận hưởng YouTube Premium ngay trên mọi thiết bị (TV, điện thoại, máy tính).',
    variants: [
      { id: 'v3-1', label: '6 Tháng', durationDays: 180, price: 500000, salePrice: 99000 },
      { id: 'v3-2', label: '1 Năm', durationDays: 365, price: 950000, salePrice: 189000 },
    ],
  },
  {
    id: '4',
    name: 'Gemini Advanced 18 Tháng – Google AI Pro 2TB Drive',
    slug: 'gemini-advanced-18-thang',
    categoryId: 'tk-ai',
    thumbnailUrl: null,
    warrantyDays: 540,
    isFeatured: true,
    description: 'Truy cập mô hình AI mạnh mẽ nhất của Google (Gemini 1.5 Pro / Ultra), bộ nhớ ngữ cảnh 1 triệu token, tích hợp trực tiếp vào Google Docs, Gmail và 2TB dung lượng Google One Cloud.',
    instructions: '1. Bạn nhận được bộ tài khoản riêng (Email | Password | 2FA Backup).\n2. Đăng nhập tại gemini.google.com và sử dụng.\n3. Được đổi pass và liên kết số điện thoại bảo mật.',
    variants: [
      { id: 'v4-1', label: '12 Tháng', durationDays: 365, price: 2400000, salePrice: 149000 },
      { id: 'v4-2', label: '18 Tháng', durationDays: 540, price: 3600000, salePrice: 199000 },
    ],
  },
  {
    id: '5',
    name: 'Tài khoản ChatGPT Plus (GPT-4o) 1 Tháng',
    slug: 'chatgpt-plus-1-thang',
    categoryId: 'tk-ai',
    thumbnailUrl: null,
    warrantyDays: 30,
    isFeatured: true,
    description: 'Sử dụng GPT-4o không giới hạn, tạo hình ảnh DALL-E 3 siêu nét, tính năng Voice Mode trò chuyện giọng nói thời gian thực và kho GPTs tùy biến.',
    instructions: '1. Nhận tài khoản dạng email|password dùng riêng.\n2. Đăng nhập tại chatgpt.com.\n3. Bảo hành 1 đổi 1 trong suốt thời gian sử dụng.',
    variants: [
      { id: 'v5-1', label: '1 Tháng (Dùng riêng)', durationDays: 30, price: 550000, salePrice: 129000 },
      { id: 'v5-2', label: '3 Tháng', durationDays: 90, price: 1500000, salePrice: 350000 },
    ],
  },
  {
    id: '6',
    name: 'Duolingo Super 12 Tháng – Học ngoại ngữ không giới hạn tim',
    slug: 'duolingo-super-12-thang',
    categoryId: 'tk-hoc-tap',
    thumbnailUrl: null,
    warrantyDays: 365,
    isFeatured: true,
    description: 'Học mọi ngôn ngữ không lo mất tim, không có quảng cáo chen ngang, luyện tập phát âm và bài kiểm tra cá nhân hóa không giới hạn.',
    instructions: '1. Nhận đường link kích hoạt Super Duolingo tự động.\n2. Bấm vào link trên trình duyệt có đăng nhập tài khoản Duolingo của bạn.\n3. Tài khoản tự động được nâng cấp lên gói Super.',
    variants: [
      { id: 'v6-1', label: '12 Tháng (Link tự kích hoạt)', durationDays: 365, price: 450000, salePrice: 39000 },
    ],
  },
];

async function main() {
  console.log('Seeding Supabase categories and products...');

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, slug: cat.slug, icon: cat.icon },
      create: { id: cat.id, name: cat.name, slug: cat.slug, icon: cat.icon },
    });
  }
  console.log('Categories seeded!');

  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId: p.categoryId,
        description: p.description,
        instructions: p.instructions,
        warrantyDays: p.warrantyDays,
        isFeatured: p.isFeatured,
      },
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        description: p.description,
        instructions: p.instructions,
        warrantyDays: p.warrantyDays,
        isFeatured: p.isFeatured,
      },
    });

    for (const v of p.variants) {
      await prisma.variant.upsert({
        where: { id: v.id },
        update: {
          label: v.label,
          durationDays: v.durationDays,
          price: v.price,
          salePrice: v.salePrice,
        },
        create: {
          id: v.id,
          productId: product.id,
          label: v.label,
          durationDays: v.durationDays,
          price: v.price,
          salePrice: v.salePrice,
        },
      });
    }
  }

  console.log('Products and variants seeded successfully into Supabase!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
