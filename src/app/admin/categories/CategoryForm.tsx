"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema, CategoryFormData } from "@/lib/validations";
import { toast } from "@/hooks/useToast";

function slugifyText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  };
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      icon: category?.icon || "",
    },
  });

  const nameValue = watch("name");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("name", val);
    if (!slugEdited) {
      setValue("slug", slugifyText(val));
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const url = isEdit ? `/api/categories/${category!.id}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Lỗi lưu danh mục");
      }

      toast({
        title: isEdit ? "Đã cập nhật danh mục" : "Đã thêm danh mục",
        variant: "success",
      });
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Vui lòng thử lại",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 space-y-4">
        <div>
          <Label className="mb-1.5 block">
            Tên danh mục <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("name")}
            onChange={handleNameChange}
            placeholder="Ví dụ: Áo thun, Quần jeans..."
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-1.5 block">
            Slug <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("slug")}
            onChange={(e) => {
              setSlugEdited(true);
              setValue("slug", e.target.value);
            }}
            placeholder="ao-thun"
          />
          {errors.slug && (
            <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
          )}
          <p className="text-xs text-[#9E9E9E] mt-1">
            Chỉ chứa a-z, 0-9, dấu gạch ngang. Tự động tạo từ tên.
          </p>
        </div>

        <div>
          <Label className="mb-1.5 block">Icon (emoji)</Label>
          <Input {...register("icon")} placeholder="👗" className="text-lg w-20" />
          <p className="text-xs text-[#9E9E9E] mt-1">Tùy chọn. Ví dụ: 👗 👟 💍</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : isEdit ? (
            "Cập nhật"
          ) : (
            "Thêm danh mục"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
        >
          Hủy
        </Button>
      </div>
    </form>
  );
}
