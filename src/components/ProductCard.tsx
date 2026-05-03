"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image?: string;
  slug: string;
  category?: string;
  firstVariantPrice?: number | null;
}

export default function ProductCard({
  id,
  name,
  price,
  salePrice,
  image,
  slug,
  category,
  firstVariantPrice,
}: ProductCardProps) {
  // If variant has a price, use it as base display price
  const basePrice = firstVariantPrice ?? price;
  const displayPrice = salePrice && salePrice < basePrice ? salePrice : basePrice;
  const originalPrice = salePrice && salePrice < basePrice ? basePrice : null;
  const hasDiscount = !!originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((basePrice - displayPrice) / basePrice) * 100)
    : 0;

  return (
    <Link href={`/products/${id}`} className="group block">
      <div
        className="bg-white rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-md"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#F5F5F5]">
              <ShoppingBag className="mx-auto h-10 w-10 text-[#E0E0E0]" />
            </div>
          )}
          {hasDiscount && discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-[#EE4D2D] text-white text-xs font-bold px-1.5 py-0.5 rounded" style={{ fontSize: "11px" }}>
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5">
          <h3 className="text-sm text-[#212121] line-clamp-2 leading-5 mb-1.5 font-normal">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-[#EE4D2D]">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && originalPrice && (
              <span className="text-xs text-[#9E9E9E] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {category && (
            <p className="text-xs text-[#9E9E9E] mt-1 line-clamp-1">{category}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
