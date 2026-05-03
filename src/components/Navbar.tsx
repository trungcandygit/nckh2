"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function ShopeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/>
    </svg>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E0E0E0]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      {/* Main row */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xl font-bold text-[#EE4D2D] tracking-tight">TINORI</span>
          </Link>

          {/* Search box - desktop */}
          <form action="/products" className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full">
              <input
                name="q"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 h-10 px-4 text-sm border border-[#E0E0E0] border-r-0 rounded-l-md outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]/20 placeholder:text-[#9E9E9E] transition-colors"
              />
              <button
                type="submit"
                className="h-10 px-4 bg-[#EE4D2D] text-white rounded-r-md hover:bg-[#D73211] transition-colors flex items-center gap-1.5 text-sm font-medium"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Cart */}
            <div className="relative">
              <CartDrawer />
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-[#616161] hover:text-[#212121] hover:bg-[#F5F5F5] rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Second row - nav links */}
        <nav className="hidden md:flex items-center gap-1 pb-2">
          {[
            { href: "/", label: "Trang chủ" },
            { href: "/products", label: "Sản phẩm" },
            { href: "/order-tracking", label: "Tra đơn hàng" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm text-[#616161] hover:text-[#212121] hover:bg-[#F5F5F5] rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.facebook.com/tinori.official"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#616161] hover:text-[#1877F2] hover:bg-[#F0F2FF] rounded-md transition-colors"
          >
            <FacebookIcon className="h-4 w-4" />
            Facebook
          </a>
          <a
            href="https://shopee.vn/tinori"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#616161] hover:text-[#EE4D2D] hover:bg-[#FFF0ED] rounded-md transition-colors"
          >
            <ShopeeIcon className="h-4 w-4" />
            Shopee
          </a>
        </nav>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <form action="/products" className="flex">
          <input
            name="q"
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 h-9 px-3 text-sm border border-[#E0E0E0] border-r-0 rounded-l-md outline-none focus:border-[#EE4D2D] placeholder:text-[#9E9E9E]"
          />
          <button
            type="submit"
            className="h-9 px-3 bg-[#EE4D2D] text-white rounded-r-md hover:bg-[#D73211] transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E0E0E0] px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {[
              { href: "/", label: "Trang chủ" },
              { href: "/products", label: "Sản phẩm" },
              { href: "/order-tracking", label: "Tra đơn hàng" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2.5 text-sm text-[#616161] hover:text-[#212121] hover:bg-[#F5F5F5] rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://www.facebook.com/tinori.official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#616161] hover:text-[#1877F2] hover:bg-[#F5F5F5] rounded-md transition-colors"
            >
              <FacebookIcon className="h-4 w-4" />
              Facebook
            </a>
            <a
              href="https://shopee.vn/tinori"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#616161] hover:text-[#EE4D2D] hover:bg-[#F5F5F5] rounded-md transition-colors"
            >
              <ShopeeIcon className="h-4 w-4" />
              Shopee
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
