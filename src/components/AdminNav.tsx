"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Store,
  Menu,
  X,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: Tag },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-[#E0E0E0]">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E0E0E0]">
          <div className="w-9 h-9 rounded-lg bg-[#EE4D2D] flex items-center justify-center">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#212121]">Tinori Admin</h1>
            <p className="text-xs text-[#9E9E9E]">Quản lý cửa hàng</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                  isActive
                    ? "bg-[#FFF0ED] text-[#EE4D2D] border-l-2 border-[#EE4D2D] pl-[10px]"
                    : "text-[#616161] hover:bg-[#FAFAFA] hover:text-[#212121]"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#E0E0E0] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#616161] hover:bg-[#FAFAFA] hover:text-[#212121] transition-colors text-sm font-medium"
          >
            <Store className="h-4 w-4" />
            Xem cửa hàng
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-[#616161] hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#EE4D2D] flex items-center justify-center">
            <Store className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-[#212121]">Tinori Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-[#616161]">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-30 pt-14"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed top-14 left-0 right-0 bg-white border-b border-[#E0E0E0] z-40 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                    isActive
                      ? "bg-[#FFF0ED] text-[#EE4D2D]"
                      : "text-[#616161] hover:bg-[#FAFAFA] hover:text-[#212121]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-[#616161] hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </>
      )}
    </>
  );
}
