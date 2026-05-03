"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Store, Menu, X, Tag } from "lucide-react";
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

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-[#FFF0ED] text-[#EE4D2D] font-medium"
            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
        )}
      >
        <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-[#EE4D2D]" : "text-neutral-400")} />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop sidebar — Apple minimal white */}
      <div className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-neutral-200">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-neutral-100">
          <div className="w-8 h-8 bg-[#EE4D2D] rounded-lg flex items-center justify-center">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 leading-tight">Tinori Admin</p>
            <p className="text-[11px] text-neutral-400">Quản lý cửa hàng</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>

        <div className="px-3 py-4 border-t border-neutral-100 space-y-0.5">
          <Link href="/" target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
            <Store className="h-4 w-4 text-neutral-400" />
            Xem cửa hàng
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-sm text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4 text-neutral-400" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white border-b border-neutral-200 px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#EE4D2D] rounded-md flex items-center justify-center">
            <Store className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-neutral-900">Tinori Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-md">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/20 pt-14" onClick={() => setMobileOpen(false)} />
          <div className="lg:hidden fixed top-14 left-0 right-0 bg-white z-40 border-b border-neutral-200 px-3 py-3 space-y-0.5">
            {navItems.map((item) => <NavLink key={item.href} item={item} />)}
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </>
      )}
    </>
  );
}
