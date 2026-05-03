"use client";

import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

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
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 h-14">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-lg font-bold text-[#EE4D2D] tracking-tight">TINORI</span>
          </Link>

          {/* Search — desktop */}
          <form action="/products" className="hidden md:flex flex-1 max-w-md">
            <div className="flex w-full rounded-full border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors focus-within:border-neutral-400">
              <input
                name="q"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 h-9 px-4 text-sm outline-none bg-transparent placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="h-9 px-4 bg-[#EE4D2D] text-white hover:bg-[#D73211] transition-colors flex items-center"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Right */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <CartDrawer />
            <button
              className="md:hidden p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-0.5 pb-2">
          {[
            { href: "/", label: "Trang chủ" },
            { href: "/products", label: "Sản phẩm" },
            { href: "/order-tracking", label: "Tra đơn hàng" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.facebook.com/tinori.official"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-500 hover:text-[#1877F2] hover:bg-blue-50 rounded-md transition-colors"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
            Facebook
          </a>
          <a
            href="https://shopee.vn/tinori"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-500 hover:text-[#EE4D2D] hover:bg-[#FFF0ED] rounded-md transition-colors"
          >
            <ShopeeIcon className="h-3.5 w-3.5" />
            Shopee
          </a>
        </nav>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <form action="/products">
          <div className="flex rounded-full border border-neutral-200 overflow-hidden">
            <input
              name="q"
              type="text"
              placeholder="Tìm kiếm..."
              className="flex-1 h-9 px-4 text-sm outline-none bg-transparent placeholder:text-neutral-400"
            />
            <button type="submit" className="h-9 px-4 bg-[#EE4D2D] text-white hover:bg-[#D73211] transition-colors">
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-4 pb-4">
          <nav className="flex flex-col gap-0.5 pt-2">
            {[
              { href: "/", label: "Trang chủ" },
              { href: "/products", label: "Sản phẩm" },
              { href: "/order-tracking", label: "Tra đơn hàng" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://www.facebook.com/tinori.official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-600 hover:text-[#1877F2] hover:bg-neutral-50 rounded-md transition-colors"
            >
              <FacebookIcon className="h-4 w-4" />
              Facebook
            </a>
            <a
              href="https://shopee.vn/tinori"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-600 hover:text-[#EE4D2D] hover:bg-neutral-50 rounded-md transition-colors"
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
