import Link from "next/link";
import { ArrowRight, Truck, Shield, RefreshCw, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

async function getProducts() {
  try {
    const [featured, latest, sale, categories] = await Promise.all([
      prisma.product.findMany({
        where: { featured: true, active: true },
        include: { images: { where: { isPrimary: true }, take: 1 }, category: true, variants: { orderBy: { createdAt: "asc" }, take: 1 } },
        take: 8, orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { active: true },
        include: { images: { where: { isPrimary: true }, take: 1 }, category: true, variants: { orderBy: { createdAt: "asc" }, take: 1 } },
        take: 8, orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { active: true, salePrice: { not: null } },
        include: { images: { where: { isPrimary: true }, take: 1 }, category: true, variants: { orderBy: { createdAt: "asc" }, take: 1 } },
        take: 8, orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({ take: 8, orderBy: { name: "asc" } }),
    ]);
    return { featured, latest, sale, categories };
  } catch {
    return { featured: [], latest: [], sale: [], categories: [] };
  }
}

export default async function HomePage() {
  const { featured, latest, sale, categories } = await getProducts();

  return (
    <div>
      {/* Hero — clean orange, not noisy */}
      <section className="bg-[#EE4D2D] text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 flex flex-col items-center text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-4">Tinori Official Store</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
            Thời Trang &amp; Phụ Kiện<br />
            <span className="text-white/80 font-medium">Chất Lượng — Giá Tốt</span>
          </h1>
          <p className="text-sm text-white/70 mb-8 max-w-sm">
            Hàng ngàn sản phẩm trending, giao hàng nhanh toàn quốc, đặt cọc chỉ 25.000đ
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#EE4D2D] px-6 py-2.5 text-sm font-semibold hover:bg-[#FFF0ED] transition-colors shadow-sm"
            >
              Mua sắm ngay <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://www.facebook.com/tinori.official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-6 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <FacebookIcon className="h-4 w-4" />
              Theo dõi Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Truck, title: "Giao hàng toàn quốc", desc: "Nhanh — An toàn" },
              { icon: Shield, title: "Đảm bảo chất lượng", desc: "Hàng chính hãng" },
              { icon: RefreshCw, title: "Đổi trả 7 ngày", desc: "Không câu hỏi" },
              { icon: Zap, title: "Flash sale mỗi ngày", desc: "Ưu đãi độc quyền" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-[#EE4D2D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800 leading-tight">{title}</p>
                  <p className="text-xs text-neutral-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pt-10 pb-2">
          <h2 className="text-base font-semibold text-neutral-900 mb-4">Danh mục</h2>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/products"
              className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 bg-[#FFF0ED] rounded-xl hover:bg-[#FFE0DA] transition-colors min-w-[72px]"
            >
              <span className="text-xl">🛍️</span>
              <span className="text-[11px] font-medium text-[#EE4D2D]">Tất cả</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 bg-white rounded-xl border border-neutral-200 hover:border-[#EE4D2D] hover:bg-[#FFF0ED]/40 transition-colors min-w-[72px]"
              >
                <span className="text-xl">{cat.icon || "📦"}</span>
                <span className="text-[11px] font-medium text-neutral-700 line-clamp-1">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Flash Sale */}
      {sale.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 bg-[#EE4D2D] text-white px-2.5 py-1 rounded-md text-xs font-bold">
                <Zap className="h-3 w-3" />FLASH SALE
              </span>
              <span className="text-sm text-neutral-400">Hôm nay</span>
            </div>
            <Link href="/products?sort=price_asc" className="text-sm text-[#EE4D2D] hover:text-[#D73211] transition-colors flex items-center gap-1">
              Xem thêm <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {sale.map((p) => (
              <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} salePrice={p.salePrice} image={p.images[0]?.url} slug={p.slug} category={p.category?.name} firstVariantPrice={p.variants[0]?.price} />
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Sản phẩm nổi bật</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Được yêu thích nhất</p>
            </div>
            <Link href="/products?featured=true" className="text-sm text-[#EE4D2D] hover:text-[#D73211] transition-colors flex items-center gap-1">
              Xem thêm <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {featured.map((p) => (
              <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} salePrice={p.salePrice} image={p.images[0]?.url} slug={p.slug} category={p.category?.name} firstVariantPrice={p.variants[0]?.price} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Mới nhất</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Vừa cập nhật</p>
          </div>
          <Link href="/products" className="text-sm text-[#EE4D2D] hover:text-[#D73211] transition-colors flex items-center gap-1">
            Tất cả <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {latest.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {latest.map((p) => (
              <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} salePrice={p.salePrice} image={p.images[0]?.url} slug={p.slug} category={p.category?.name} firstVariantPrice={p.variants[0]?.price} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
            <p className="text-neutral-400 mb-4">Sắp có sản phẩm mới</p>
            <a
              href="https://www.facebook.com/tinori.official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#EE4D2D] text-white px-5 py-2 text-sm font-medium hover:bg-[#D73211] transition-colors"
            >
              <FacebookIcon className="h-4 w-4" />
              Theo dõi Fanpage
            </a>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#EE4D2D] text-white py-12 mt-4">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold mb-2">Theo dõi Tinori trên Facebook</h2>
          <p className="text-sm text-white/70 mb-6">Sản phẩm mới, flash sale, và ưu đãi độc quyền mỗi ngày</p>
          <a
            href="https://www.facebook.com/tinori.official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#EE4D2D] px-6 py-2.5 text-sm font-semibold hover:bg-[#FFF0ED] transition-colors"
          >
            <FacebookIcon className="h-4 w-4" />
            Theo dõi ngay
          </a>
        </div>
      </section>
    </div>
  );
}
