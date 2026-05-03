import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import Link from "next/link";
import { Plus, Edit, Package, Upload } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "./DeleteProductButton";
import Image from "next/image";

async function getProducts() {
  return prisma.product.findMany({
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const products = await getProducts();

  return (
    <div className="lg:pl-64">
      <AdminNav />
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#212121]">Sản phẩm</h1>
            <p className="text-[#9E9E9E] text-sm">{products.length} sản phẩm</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/products/import">
              <Button variant="outline">
                <Upload className="h-4 w-4" />
                Import CSV
              </Button>
            </Link>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#616161]">Sản phẩm</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#616161] hidden md:table-cell">
                    Danh mục
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[#616161]">Giá</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#616161] hidden sm:table-cell">
                    Kho
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[#616161]">
                    Trạng thái
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[#616161]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F5F5F5] flex-shrink-0">
                          {product.images[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-[#E0E0E0]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#212121] line-clamp-1">{product.name}</p>
                          <p className="text-xs text-[#9E9E9E]">{product._count.orderItems} đơn</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-[#F5F5F5] text-[#616161] px-2 py-1 rounded-full font-medium">
                        {product.category?.name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div>
                        <p className="font-bold text-[#EE4D2D]">
                          {formatPrice(product.salePrice || product.price)}
                        </p>
                        {product.salePrice && (
                          <p className="text-xs text-[#9E9E9E] line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span
                        className={`text-sm font-semibold ${
                          product.stock > 10
                            ? "text-[#00AB56]"
                            : product.stock > 0
                            ? "text-[#FF8C00]"
                            : "text-red-500"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.active ? (
                        <span className="text-xs bg-green-50 text-[#00AB56] px-2 py-1 rounded-full font-medium">
                          Đang bán
                        </span>
                      ) : (
                        <span className="text-xs bg-[#F5F5F5] text-[#9E9E9E] px-2 py-1 rounded-full font-medium">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <button className="p-2 text-[#616161] hover:text-[#212121] hover:bg-[#F5F5F5] rounded-md transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <Package className="h-12 w-12 text-[#E0E0E0] mx-auto mb-3" />
                      <p className="text-[#9E9E9E] font-medium">Chưa có sản phẩm nào</p>
                      <Link href="/admin/products/new" className="inline-block mt-3">
                        <Button size="sm">
                          <Plus className="h-4 w-4" />
                          Thêm sản phẩm đầu tiên
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
