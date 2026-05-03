import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

interface SearchParams {
  category?: string;
  q?: string;
  sort?: string;
  featured?: string;
}

async function getProducts(searchParams: SearchParams) {
  try {
    const where: Record<string, unknown> = { active: true };

    if (searchParams.category) {
      where.category = { slug: searchParams.category };
    }
    if (searchParams.featured === "true") {
      where.featured = true;
    }
    if (searchParams.q) {
      where.name = { contains: searchParams.q };
    }

    const orderBy: Record<string, string> = {};
    if (searchParams.sort === "price_asc") orderBy.price = "asc";
    else if (searchParams.sort === "price_desc") orderBy.price = "desc";
    else orderBy.createdAt = "desc";

    return await prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        variants: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      orderBy,
      take: 48,
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const activeCategory = params.category;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#212121]">
          {params.q
            ? `Kết quả tìm kiếm: "${params.q}"`
            : params.category
            ? categories.find((c) => c.slug === params.category)?.name || "Sản phẩm"
            : params.featured
            ? "Sản phẩm nổi bật"
            : "Tất cả sản phẩm"}
        </h1>
        <p className="text-[#9E9E9E] text-sm mt-1">{products.length} sản phẩm</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div
            className="bg-white rounded-lg p-4 sticky top-20 border border-[#E0E0E0]"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          >
            <h3 className="font-semibold text-[#212121] mb-4 text-sm">Danh mục</h3>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                    !activeCategory
                      ? "bg-[#FFF0ED] text-[#EE4D2D] font-semibold border-l-2 border-[#EE4D2D] pl-[10px]"
                      : "text-[#616161] hover:bg-[#FAFAFA] hover:text-[#212121]"
                  }`}
                >
                  Tất cả sản phẩm
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      activeCategory === cat.slug
                        ? "bg-[#FFF0ED] text-[#EE4D2D] font-semibold border-l-2 border-[#EE4D2D] pl-[10px]"
                        : "text-[#616161] hover:bg-[#FAFAFA] hover:text-[#212121]"
                    }`}
                  >
                    {cat.icon && <span className="mr-1">{cat.icon}</span>}
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Sort & Filter bar */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-lg px-4 py-3 border border-[#E0E0E0]">
            <div className="flex items-center gap-2 text-sm text-[#616161]">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sắp xếp:</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: "", label: "Mới nhất" },
                { value: "price_asc", label: "Giá tăng" },
                { value: "price_desc", label: "Giá giảm" },
              ].map((opt) => (
                <Link
                  key={opt.value}
                  href={{
                    pathname: "/products",
                    query: {
                      ...(activeCategory && { category: activeCategory }),
                      ...(params.q && { q: params.q }),
                      ...(opt.value && { sort: opt.value }),
                    },
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    (params.sort || "") === opt.value
                      ? "bg-[#EE4D2D] text-white"
                      : "bg-[#F5F5F5] text-[#616161] hover:bg-[#EEEEEE]"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile categories */}
          {categories.length > 0 && (
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
              <Link
                href="/products"
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors border ${
                  !activeCategory
                    ? "bg-[#EE4D2D] text-white border-[#EE4D2D]"
                    : "bg-white text-[#616161] border-[#E0E0E0]"
                }`}
              >
                Tất cả
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors border ${
                    activeCategory === cat.slug
                      ? "bg-[#EE4D2D] text-white border-[#EE4D2D]"
                      : "bg-white text-[#616161] border-[#E0E0E0]"
                  }`}
                >
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-[#E0E0E0]">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-[#9E9E9E]">
                Thử tìm kiếm với từ khóa khác hoặc xem tất cả sản phẩm
              </p>
              <Link href="/products">
                <button className="mt-4 px-6 py-2 bg-[#EE4D2D] text-white rounded-md font-medium hover:bg-[#D73211] transition-colors">
                  Xem tất cả
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((product) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
