/* Inspired by vercel/commerce GridTileImage — MIT License */
import Link from "next/link";
import Image from "next/image";
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
  category,
  firstVariantPrice,
}: ProductCardProps) {
  const displayPrice = firstVariantPrice || salePrice || price;
  const hasDiscount = salePrice && salePrice < price;
  const discountPct = hasDiscount ? Math.round(((price - salePrice!) / price) * 100) : 0;

  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-white hover:border-neutral-400 transition-colors duration-200">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-100">
              <span className="text-4xl opacity-30">🛍️</span>
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-[#EE4D2D] text-white text-[11px] font-semibold px-1.5 py-0.5 rounded">
              -{discountPct}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {category && (
            <p className="text-[11px] text-neutral-400 mb-1 uppercase tracking-wide">{category}</p>
          )}
          <h3 className="text-sm font-medium text-neutral-800 line-clamp-2 leading-5 mb-2">
            {name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold text-[#EE4D2D]">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
