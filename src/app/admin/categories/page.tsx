import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteCategoryButton from "./DeleteCategoryButton";

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const categories = await getCategories();

  return (
    <div className="lg:pl-64">
      <AdminNav />
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#212121]">Danh mục</h1>
            <p className="text-[#9E9E9E] text-sm">{categories.length} danh mục</p>
          </div>
          <Link href="/admin/categories/new">
            <Button>
              <Plus className="h-4 w-4" />
              Thêm danh mục
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#616161]">Danh mục</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#616161]">Slug</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#616161]">Sản phẩm</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#616161]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {cat.icon && <span className="text-lg">{cat.icon}</span>}
                        <span className="font-medium text-[#212121]">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-[#F5F5F5] text-[#616161] px-2 py-1 rounded">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-[#212121]">
                        {cat._count.products}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/categories/${cat.id}`}>
                          <Button variant="outline" size="sm">
                            Sửa
                          </Button>
                        </Link>
                        <DeleteCategoryButton
                          id={cat.id}
                          name={cat.name}
                          productCount={cat._count.products}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center">
                      <Tag className="h-12 w-12 text-[#E0E0E0] mx-auto mb-3" />
                      <p className="text-[#9E9E9E] font-medium">Chưa có danh mục nào</p>
                      <Link href="/admin/categories/new" className="inline-block mt-3">
                        <Button size="sm">
                          <Plus className="h-4 w-4" />
                          Thêm danh mục đầu tiên
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
