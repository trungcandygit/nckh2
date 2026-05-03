"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart, Truck, Shield, MessageCircle, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  type: string;
  stock: number;
  price?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: { id: string; url: string; isPrimary: boolean }[];
  variants: ProductVariant[];
  category?: { name: string; slug: string };
}

/* Inspired by vercel/commerce Gallery component — MIT License */
function Gallery({ images, productName }: { images: Product["images"]; productName: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-100">
        <ShoppingCart className="h-16 w-16 text-neutral-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
        <Image
          src={images[active].url}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((p) => (p - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 text-neutral-700 hover:bg-white transition-colors shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 text-neutral-700 hover:bg-white transition-colors shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                active === i ? "border-[#EE4D2D]" : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square rounded-2xl bg-neutral-100" />
          <div className="space-y-4">
            <div className="h-5 bg-neutral-100 rounded w-1/4" />
            <div className="h-8 bg-neutral-100 rounded w-3/4" />
            <div className="h-8 bg-neutral-100 rounded w-1/3" />
            <div className="h-24 bg-neutral-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-400 mb-4">Không tìm thấy sản phẩm</p>
        <Link href="/products" className="text-sm text-[#EE4D2D] hover:underline">← Quay lại danh sách</Link>
      </div>
    );
  }

  const variantTypes = [...new Set(product.variants.map((v) => v.type))];
  const selectedVariant = variantTypes.length > 0
    ? product.variants.find((v) => selectedVariants[v.type] === v.id)
    : undefined;

  const basePrice = selectedVariant?.price || product.price;
  const salePrice = product.salePrice;
  const displayPrice = salePrice && salePrice < basePrice ? salePrice : basePrice;
  const hasDiscount = !!(salePrice && salePrice < basePrice);
  const discountPct = hasDiscount ? Math.round(((basePrice - displayPrice) / basePrice) * 100) : 0;

  const variantGroups: Record<string, ProductVariant[]> = {};
  product.variants.forEach((v) => {
    if (!variantGroups[v.type]) variantGroups[v.type] = [];
    variantGroups[v.type].push(v);
  });

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant?.id || "default"}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: product.images[0]?.url || "",
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantValue: selectedVariant?.value,
    });
    setAddedToCart(true);
    toast({ title: "Đã thêm vào giỏ hàng!", description: `${product.name} x${quantity}` });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link href="/" className="hover:text-neutral-700 transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-neutral-700 transition-colors">Sản phẩm</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-neutral-700 transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-neutral-600 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <Gallery images={product.images} productName={product.name} />

        {/* Product info */}
        <div>
          {product.category && (
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="text-2xl font-semibold text-neutral-900 leading-snug mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-[#EE4D2D]">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <>
                <span className="text-base text-neutral-400 line-through">{formatPrice(basePrice)}</span>
                <span className="text-xs font-semibold bg-[#FFF0ED] text-[#EE4D2D] px-2 py-0.5 rounded">
                  -{discountPct}%
                </span>
              </>
            )}
          </div>

          {/* Variants */}
          {Object.entries(variantGroups).map(([type, variants]) => (
            <div key={type} className="mb-5">
              <p className="text-sm font-medium text-neutral-700 mb-2">{type}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariants((prev) => ({ ...prev, [type]: v.id }))}
                    disabled={v.stock === 0}
                    className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                      selectedVariants[type] === v.id
                        ? "border-[#EE4D2D] bg-[#FFF0ED] text-[#EE4D2D]"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                    } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {v.value}
                    {v.price && v.price !== product.price && (
                      <span className="ml-1 text-xs opacity-70">({formatPrice(v.price)})</span>
                    )}
                    {v.stock === 0 && " · Hết"}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium text-neutral-700 mb-2">Số lượng</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full border border-neutral-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-sm text-neutral-400">Còn {product.stock} sản phẩm</span>
            </div>
          </div>

          {/* Deposit notice */}
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-6">
            <p className="text-sm font-medium text-amber-800">Đặt cọc 25.000đ khi đặt hàng</p>
            <p className="text-xs text-amber-600 mt-0.5">Đơn hàng được xử lý ngay sau khi xác nhận cọc</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : product.stock === 0
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-[#EE4D2D] text-white hover:bg-[#D73211]"
              }`}
            >
              {addedToCart ? (
                <><Check className="h-4 w-4" />Đã thêm!</>
              ) : (
                <><ShoppingCart className="h-4 w-4" />{product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}</>
              )}
            </button>
            <Link
              href="/checkout"
              className="flex flex-1 items-center justify-center rounded-full border border-neutral-200 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
            >
              Mua ngay
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 pt-6 border-t border-neutral-100">
            {[
              { icon: Truck, label: "Giao toàn quốc" },
              { icon: Shield, label: "Đảm bảo chất lượng" },
              { icon: MessageCircle, label: "Hỗ trợ 24/7" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <Icon className="h-4 w-4 text-neutral-400" />
                <span className="text-[11px] text-neutral-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 pt-8 border-t border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-900 mb-4">Mô tả sản phẩm</h2>
          <div className="text-sm text-neutral-600 whitespace-pre-wrap leading-relaxed max-w-2xl">
            {product.description}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-700 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}
