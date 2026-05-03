import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tinori - Shop Thời Trang & Phụ Kiện",
  description: "Shop thời trang online Tinori - Hàng chất lượng, giao hàng nhanh",
  keywords: "thời trang, phụ kiện, shop online, tinori",
  openGraph: {
    title: "Tinori - Shop Thời Trang & Phụ Kiện",
    description: "Shop thời trang và phụ kiện online",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen bg-[#FAFAFA] font-[family-name:var(--font-inter)] antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
