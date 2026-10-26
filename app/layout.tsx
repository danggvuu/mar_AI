import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";
import AuthModal from "@/components/AuthModal";

export const metadata: Metadata = {
  title: {
    default: "AccStore - Tài Khoản Bản Quyền Giá Rẻ",
    template: "%s | AccStore",
  },
  description:
    "Mua tài khoản bản quyền giá rẻ: CapCut Pro, Canva Pro, YouTube Premium và nhiều công cụ số uy tín.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "AccStore",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-[#0f172a] text-[#f1f5f9] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 sm:pt-28">{children}</main>
        <Footer />
        <FloatingDock />
        <AuthModal />
      </body>
    </html>
  );
}
