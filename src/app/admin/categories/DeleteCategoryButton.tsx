"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
  productCount: number;
}

export default function DeleteCategoryButton({ id, name, productCount }: DeleteCategoryButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (productCount > 0) {
      toast({
        title: "Không thể xóa",
        description: `Danh mục "${name}" đang có ${productCount} sản phẩm`,
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Xóa danh mục "${name}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi xóa danh mục");
      toast({ title: "Đã xóa danh mục", variant: "success" });
      router.refresh();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Vui lòng thử lại",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading || productCount > 0}
      className="text-red-500 hover:text-red-600 hover:bg-red-50 border-[#E0E0E0] disabled:opacity-40"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
