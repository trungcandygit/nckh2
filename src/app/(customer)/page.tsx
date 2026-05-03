import Link from "next/link";
import { ArrowRight, Truck, Shield, RefreshCw, Zap } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true, active: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        variants: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ take: 8, orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

async function getLatestProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        variants: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getSaleProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true, salePrice: { not: null } },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        variants: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories, latestProducts, saleProducts] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getLatestProducts(),
    getSaleProducts(),
  ]);

  return (
    <div>
      {/* Hero Banner - Shopee orange gradient */}
      <section
        className="relative text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #EE4D2D 0%, #FF7337 50%, #FF9A44 100%)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <Zap className="h-4 w-4 text-yellow-200" />
            Flash Sale mỗi ngày
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Thời Trang &{" "}
            <span className="text-yellow-200">Phụ Kiện</span>
            <br />
            <span className="text-3xl md:text-4xl font-semibold text-white/90">
              Chất Lượng — Giá Tốt
            </span>
          </h1>
          <p className="text-base text-white/80 mb-8 max-w-md">
            Khám phá hàng ngàn sản phẩm thời trang trending, giá tốt, giao hàng nhanh toàn quốc
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-[#EE4D2D] hover:bg-[#FFF0ED] shadow-lg font-semibold"
              >
                Mua sắm ngay
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://www.facebook.com/tinori.official"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white/20 bg-transparent"
              >
                <FacebookIcon className="h-5 w-5" />
                Theo dõi Facebook
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white border-b border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Truck,
                title: "Giao hàng toàn quốc",
                desc: "Nhanh chóng, an toàn",
                color: "text-[#EE4D2D]",
                bg: "bg-[#FFF0ED]",
              },
              {
                icon: Shield,
                title: "Bảo đảm chất lượng",
                desc: "Hàng chính hãng 100%",
                color: "text-[#00AB56]",
                bg: "bg-green-50",
              },
              {
                icon: RefreshCw,
                title: "Đổi trả dễ dàng",
                desc: "Trong 7 ngày",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Zap,
                title: "Ưu đãi mỗi ngày",
                desc: "Flash sale hàng ngày",
                color: "text-[#FF8C00]",
                bg: "bg-orange-50",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${feature.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#212121]">{feature.title}</p>
                    <p className="text-xs text-[#9E9E9E]">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-[#212121] mb-4">Danh mục sản phẩm</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-8">
            <Link
              href="/products"
              className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-[#FFF0ED] rounded-lg hover:bg-[#FFE0DA] transition-colors text-center min-w-[72px]"
            >
              <div className="w-10 h-10 bg-[#EE4D2D] rounded-lg flex items-center justify-center">
                <span className="text-xl">🛍️</span>
              </div>
              <span className="text-xs font-medium text-[#EE4D2D] line-clamp-1">Tất cả</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-[#E0E0E0] hover:border-[#EE4D2D] hover:bg-[#FFF0ED]/30 transition-colors text-center min-w-[72px]"
              >
                <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                  <span className="text-xl">{cat.icon || "📦"}</span>
                </div>
                <span className="text-xs font-medium text-[#212121] line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Flash Sale */}
      {saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#EE4D2D] text-white px-3 py-1.5 rounded-md">
                <Zap className="h-4 w-4" />
                <span className="font-bold text-sm">FLASH SALE</span>
              </div>
              <span className="text-sm text-[#9E9E9E]">Giá ưu đãi hôm nay</span>
            </div>
            <Link href="/products?sort=price_asc">
              <Button variant="ghost" size="sm" className="text-[#EE4D2D] hover:text-[#D73211]">
                Xem thêm <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {saleProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                salePrice={product.salePrice}
                image={product.images[0]?.url}
                slug={product.slug}
                category={product.category?.name}
                firstVariantPrice={product.variants[0]?.price}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#212121]">Sản phẩm nổi bật</h2>
              <p className="text-[#9E9E9E] text-sm">Được yêu thích nhất</p>
            </div>
            <Link href="/products?featured=true">
              <Button variant="outline" size="sm">
                Xem thêm <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                salePrice={product.salePrice}
                image={product.images[0]?.url}
                slug={product.slug}
                category={product.category?.name}
                firstVariantPrice={product.variants[0]?.price}
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#212121]">Sản phẩm mới nhất</h2>
            <p className="text-[#9E9E9E] text-sm">Vừa cập nhật</p>
          </div>
          <Link href="/products">
            <Button variant="outline" size="sm">
              Tất cả sản phẩm <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {latestProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {latestProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                salePrice={product.salePrice}
                image={product.images[0]?.url}
                slug={product.slug}
                category={product.category?.name}
                firstVariantPrice={product.variants[0]?.price}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-[#E0E0E0]">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">Sắp có sản phẩm mới!</h3>
            <p className="text-[#9E9E9E] mb-6">
              Theo dõi fanpage để không bỏ lỡ sản phẩm mới nhất
            </p>
            <a
              href="https://www.facebook.com/tinori.official"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>
                <FacebookIcon className="h-5 w-5" />
                Theo dõi Fanpage
              </Button>
            </a>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section
        className="text-white py-12 my-8"
        style={{ background: "linear-gradient(135deg, #EE4D2D 0%, #D73211 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Theo dõi Tinori trên Facebook</h2>
          <p className="text-white/80 mb-6 text-sm">
            Cập nhật sản phẩm mới, ưu đãi độc quyền và flash sale mỗi ngày
          </p>
          <a
            href="https://www.facebook.com/tinori.official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-white text-[#EE4D2D] hover:bg-[#FFF0ED]" size="lg">
              <FacebookIcon className="h-5 w-5" />
              Theo dõi ngay
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
