"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ChevronLeft,
  Star,
  Truck,
  Shield,
  MessageCircle,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-[#F5F5F5] rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-[#F5F5F5] rounded w-3/4" />
            <div className="h-6 bg-[#F5F5F5] rounded w-1/4" />
            <div className="h-24 bg-[#F5F5F5] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-[#212121] mb-4">
          Không tìm thấy sản phẩm
        </h2>
        <Link href="/products">
          <Button>Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  // Calculate price - check selected variant price first
  const variantTypes = Object.keys(
    product.variants.reduce((acc, v) => ({ ...acc, [v.type]: true }), {} as Record<string, boolean>)
  );
  const selectedVariant =
    variantTypes.length > 0
      ? product.variants.find((v) => selectedVariants[v.type] === v.id)
      : undefined;

  const basePrice = selectedVariant?.price || product.price;
  const salePrice = product.salePrice;
  const displayPrice =
    salePrice && salePrice < basePrice ? salePrice : basePrice;
  const hasDiscount = salePrice && salePrice < basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((basePrice - displayPrice) / basePrice) * 100)
    : 0;

  // Group variants by type
  const variantGroups: Record<string, ProductVariant[]> = {};
  product.variants.forEach((v) => {
    if (!variantGroups[v.type]) variantGroups[v.type] = [];
    variantGroups[v.type].push(v);
  });

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${selectedVariant?.id || "default"}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: product.images[0]?.url || "",
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantValue: selectedVariant?.value,
    };

    addItem(cartItem);
    setAddedToCart(true);
    toast({
      title: "Đã thêm vào giỏ hàng!",
      description: `${product.name} x${quantity}`,
      variant: "success",
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#9E9E9E] mb-6">
        <Link href="/" className="hover:text-[#EE4D2D] transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#EE4D2D] transition-colors">
          Sản phẩm
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-[#EE4D2D] transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#212121] font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-[#F5F5F5] mb-3">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-[#F5F5F5] text-[#E0E0E0]">
                <ShoppingCart className="h-20 w-20 opacity-20" />
              </div>
            )}
            {hasDiscount && (
              <div className="absolute top-3 left-3 bg-[#EE4D2D] text-white text-sm font-bold px-2.5 py-1 rounded">
                -{discountPercent}%
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === i
                      ? "border-[#EE4D2D]"
                      : "border-[#E0E0E0] hover:border-[#EE4D2D]/50"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {product.category && (
            <Badge className="mb-2 bg-[#F5F5F5] text-[#616161] hover:bg-[#EEEEEE]">
              {product.category.name}
            </Badge>
          )}
          <h1 className="text-2xl font-bold text-[#212121] mb-3">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-[#EE4D2D]">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-[#9E9E9E] line-through">
                  {formatPrice(basePrice)}
                </span>
                <span className="bg-[#FFF0ED] text-[#EE4D2D] text-sm font-bold px-2 py-1 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-sm text-[#9E9E9E] ml-1">5.0</span>
          </div>

          {/* Variants */}
          {Object.entries(variantGroups).map(([type, variants]) => (
            <div key={type} className="mb-4">
              <p className="text-sm font-semibold text-[#212121] mb-2">{type}:</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() =>
                      setSelectedVariants((prev) => ({ ...prev, [type]: v.id }))
                    }
                    className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-all ${
                      selectedVariants[type] === v.id
                        ? "border-[#EE4D2D] bg-[#FFF0ED] text-[#EE4D2D]"
                        : "border-[#E0E0E0] text-[#616161] hover:border-[#EE4D2D]/50"
                    } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                    disabled={v.stock === 0}
                  >
                    {v.value}
                    {v.price && v.price !== product.price && (
                      <span className="ml-1 text-xs text-[#EE4D2D]">
                        ({formatPrice(v.price)})
                      </span>
                    )}
                    {v.stock === 0 && " (Hết)"}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#212121] mb-2">Số lượng:</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E0E0E0] rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-[#F5F5F5] transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 py-2.5 font-bold text-base min-w-[3rem] text-center border-x border-[#E0E0E0]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-[#F5F5F5] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-[#9E9E9E]">
                Còn {product.stock} sản phẩm
              </span>
            </div>
          </div>

          {/* Deposit notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
            <p className="text-sm font-semibold text-amber-800">
              💳 Cần đặt cọc 25.000đ khi đặt hàng
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Sau khi xác nhận cọc, đơn hàng sẽ được xử lý ngay
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              size="lg"
              variant={addedToCart ? "success" : "default"}
              disabled={product.stock === 0}
            >
              {addedToCart ? (
                <>
                  <Check className="h-5 w-5" />
                  Đã thêm!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                </>
              )}
            </Button>
            <Link href="/checkout" className="flex-1">
              <Button size="lg" variant="outline" className="w-full">
                Mua ngay
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Truck, text: "Giao toàn quốc" },
              { icon: Shield, text: "Bảo đảm chất lượng" },
              { icon: MessageCircle, text: "Hỗ trợ 24/7" },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 p-3 bg-[#FAFAFA] rounded-lg border border-[#F5F5F5]"
                >
                  <Icon className="h-5 w-5 text-[#EE4D2D]" />
                  <span className="text-xs text-[#616161] text-center">{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-10 bg-white rounded-lg border border-[#E0E0E0] p-6">
          <h2 className="text-lg font-bold text-[#212121] mb-4">Mô tả sản phẩm</h2>
          <div className="text-sm max-w-none text-[#616161] whitespace-pre-wrap leading-relaxed">
            {product.description}
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="mt-8">
        <Link href="/products">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    </div>
  );
}
