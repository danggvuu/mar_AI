export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  icon?: string;
  thumbnailUrl?: string;
  price: number;
  salePrice: number;
  discount: number;
  warrantyDays: number;
  soldCount: number;
  isFeatured: boolean;
  description: string;
  instructions: string;
  variants: {
    id: string;
    label: string;
    durationDays: number;
    price: number;
    salePrice: number;
  }[];
}

export const CATEGORIES = [
  { id: 'all', name: 'Tất cả', slug: 'all', icon: '⚡' },
  { id: 'tai-khoan-ban-quyen', name: 'Tài Khoản Bản Quyền', slug: 'tai-khoan-ban-quyen', icon: '🔑' },
  { id: 'tk-ai', name: 'AI & Làm Việc', slug: 'tk-ai', icon: '🤖' },
  { id: 'tk-thiet-ke', name: 'Thiết Kế & Đồ Họa', slug: 'tk-thiet-ke', icon: '🎨' },
  { id: 'tk-giai-tri', name: 'Giải Trí & Phim Ảnh', slug: 'tk-giai-tri', icon: '🎬' },
  { id: 'tk-hoc-tap', name: 'Học Tập', slug: 'tk-hoc-tap', icon: '🎓' },
];

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'Tài khoản CapCut Pro 1 Năm – Kích hoạt chính chủ',
    slug: 'capcut-pro-1-nam',
    category: 'tk-thiet-ke',
    categoryName: 'Thiết Kế & Đồ Họa',
    icon: '🎬',
    price: 650000,
    salePrice: 89000,
    discount: 86,
    warrantyDays: 365,
    soldCount: 842,
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
    category: 'tk-thiet-ke',
    categoryName: 'Thiết Kế & Đồ Họa',
    icon: '🎨',
    price: 1200000,
    salePrice: 119000,
    discount: 90,
    warrantyDays: 365,
    soldCount: 1530,
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
    category: 'tk-giai-tri',
    categoryName: 'Giải Trí & Phim Ảnh',
    icon: '▶️',
    price: 950000,
    salePrice: 189000,
    discount: 80,
    warrantyDays: 365,
    soldCount: 2190,
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
    category: 'tk-ai',
    categoryName: 'AI & Làm Việc',
    icon: '🤖',
    price: 3600000,
    salePrice: 199000,
    discount: 94,
    warrantyDays: 540,
    soldCount: 610,
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
    category: 'tk-ai',
    categoryName: 'AI & Làm Việc',
    icon: '🧠',
    price: 550000,
    salePrice: 129000,
    discount: 76,
    warrantyDays: 30,
    soldCount: 1840,
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
    category: 'tk-hoc-tap',
    categoryName: 'Học Tập',
    icon: '🦉',
    price: 450000,
    salePrice: 39000,
    discount: 91,
    warrantyDays: 365,
    soldCount: 975,
    isFeatured: true,
    description: 'Học mọi ngôn ngữ không lo mất tim, không có quảng cáo chen ngang, luyện tập phát âm và bài kiểm tra cá nhân hóa không giới hạn.',
    instructions: '1. Nhận đường link kích hoạt Super Duolingo tự động.\n2. Bấm vào link trên trình duyệt có đăng nhập tài khoản Duolingo của bạn.\n3. Tài khoản tự động được nâng cấp lên gói Super.',
    variants: [
      { id: 'v6-1', label: '12 Tháng (Link tự kích hoạt)', durationDays: 365, price: 450000, salePrice: 39000 },
    ],
  },
  {
    id: '7',
    name: 'Tài khoản Coursera Org Premium 12 Tháng',
    slug: 'coursera-org-premium-12-thang',
    category: 'tk-hoc-tap',
    categoryName: 'Học Tập',
    icon: '🎓',
    price: 3900000,
    salePrice: 89000,
    discount: 98,
    warrantyDays: 365,
    soldCount: 420,
    isFeatured: false,
    description: 'Học hàng ngàn khóa học đại học danh tiếng (Google, IBM, Meta, Stanford) và nhận chứng chỉ hoàn thành miễn phí không giới hạn.',
    instructions: '1. Nhận tài khoản tổ chức Coursera Org được cấp sẵn.\n2. Đăng nhập bằng mã 2FA 6 số theo hướng dẫn.\n3. Đăng ký học và thi nhận chứng chỉ bình thường.',
    variants: [
      { id: 'v7-1', label: '12 Tháng', durationDays: 365, price: 3900000, salePrice: 89000 },
    ],
  },
  {
    id: '8',
    name: 'Spotify Premium 1 Năm – Nghe nhạc chất lượng cao',
    slug: 'spotify-premium-1-nam',
    category: 'tk-giai-tri',
    categoryName: 'Giải Trí & Phim Ảnh',
    icon: '🎵',
    price: 590000,
    salePrice: 149000,
    discount: 75,
    warrantyDays: 365,
    soldCount: 1100,
    isFeatured: false,
    description: 'Âm thanh Very High 320kbps, không quảng cáo, tải nhạc nghe offline trên mọi thiết bị máy tính, điện thoại, loa thông minh.',
    instructions: '1. Nhập email tài khoản Spotify khi đặt đơn.\n2. Nhận link gia đình và địa chỉ kích hoạt.\n3. Đổi vùng và kích hoạt gói Premium.',
    variants: [
      { id: 'v8-1', label: '6 Tháng', durationDays: 180, price: 300000, salePrice: 79000 },
      { id: 'v8-2', label: '1 Năm', durationDays: 365, price: 590000, salePrice: 149000 },
    ],
  },
  {
    id: '9',
    name: 'Adobe Creative Cloud All Apps 1 Năm',
    slug: 'adobe-creative-cloud-1-nam',
    category: 'tk-thiet-ke',
    categoryName: 'Thiết Kế & Đồ Họa',
    icon: '🅰️',
    price: 3500000,
    salePrice: 850000,
    discount: 76,
    warrantyDays: 365,
    soldCount: 310,
    isFeatured: false,
    description: 'Trọn bộ 20+ ứng dụng Adobe (Photoshop, Illustrator, Premiere, After Effects, Lightroom...) chính chủ tải trực tiếp từ Adobe Creative Cloud Desktop.',
    instructions: '1. Cung cấp email Adobe chưa từng kích hoạt gói doanh nghiệp.\n2. Nhận thư mời tham gia tổ chức từ Adobe.\n3. Sử dụng app bản quyền kèm 100GB Cloud và Generative Fill AI.',
    variants: [
      { id: 'v9-1', label: '1 Tháng', durationDays: 30, price: 350000, salePrice: 99000 },
      { id: 'v9-2', label: '1 Năm', durationDays: 365, price: 3500000, salePrice: 850000 },
    ],
  },
];
