"use client";

/* Inspired by vercel/commerce cart/modal.tsx — MIT License */
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import LoadingDots from "@/components/LoadingDots";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const prevTotalItems = useRef(totalItems);

  /* Auto-open on add — Vercel Commerce pattern */
  useEffect(() => {
    if (totalItems > prevTotalItems.current && totalItems > 0) {
      setIsOpen(true);
    }
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  return (
    <>
      {/* Cart button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Mở giỏ hàng"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#EE4D2D] text-[10px] font-semibold text-white">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      {/* Overlay + Panel — Vercel Commerce pattern */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col border-l border-neutral-200 bg-white/90 backdrop-blur-xl md:w-[390px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <p className="text-base font-semibold text-neutral-900">
                Giỏ hàng
                {totalItems > 0 && (
                  <span className="ml-2 text-sm font-normal text-neutral-500">({totalItems} sản phẩm)</span>
                )}
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                  <ShoppingCart className="h-8 w-8 text-neutral-400" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-700">Giỏ hàng trống</p>
                  <p className="text-sm text-neutral-400 mt-1">Thêm sản phẩm để bắt đầu mua sắm</p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 rounded-full bg-[#EE4D2D] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#D73211] transition-colors"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Items list */}
                <ul className="flex-1 overflow-y-auto divide-y divide-neutral-100 px-5 py-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4">
                      {/* Image */}
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xl">🛍️</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 line-clamp-1">
                            {item.name}
                          </p>
                          {item.variantValue && (
                            <p className="text-xs text-neutral-400 mt-0.5">{item.variantValue}</p>
                          )}
                        </div>
                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 rounded-full border border-neutral-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#EE4D2D]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-neutral-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="border-t border-neutral-100 px-5 py-4 space-y-3">
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Tạm tính</span>
                    <span className="font-medium text-neutral-800">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-amber-600 bg-amber-50 rounded-md px-3 py-2">
                    <span className="font-medium">Đặt cọc 25.000đ</span>
                    <span className="font-semibold">25.000đ</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => { setIsNavigating(true); setIsOpen(false); }}
                    className="flex w-full items-center justify-center rounded-full bg-[#EE4D2D] py-3 text-sm font-semibold text-white hover:bg-[#D73211] transition-colors"
                  >
                    {isNavigating ? (
                      <LoadingDots className="bg-white" />
                    ) : (
                      "Thanh toán ngay"
                    )}
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-sm text-neutral-500 hover:text-neutral-700 transition-colors py-1"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
