import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CategoryForm from "../CategoryForm";

export default async function NewCategoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="lg:pl-64">
      <AdminNav />
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-6">
          <Link
            href="/admin/categories"
            className="flex items-center gap-1 text-sm text-[#616161] hover:text-[#212121] mb-3"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại danh mục
          </Link>
          <h1 className="text-2xl font-bold text-[#212121]">Thêm danh mục mới</h1>
        </div>

        <CategoryForm />
      </div>
    </div>
  );
}
