import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

interface ImportProduct {
  name: string;
  price: string | number;
  salePrice?: string | number;
  stock?: string | number;
  description?: string;
  category?: string;
  featured?: string | boolean;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { products } = body as { products: ImportProduct[] };

  if (!products || !Array.isArray(products) || products.length === 0) {
    return NextResponse.json({ error: "Không có dữ liệu sản phẩm" }, { status: 400 });
  }

  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (const item of products) {
    try {
      if (!item.name || !item.price) {
        results.failed++;
        results.errors.push(`Thiếu tên hoặc giá cho sản phẩm: ${item.name || "unknown"}`);
        continue;
      }

      let slug = slugify(item.name);
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) slug = `${slug}-${Date.now()}`;

      let categoryId: string | null = null;
      if (item.category) {
        const cat = await prisma.category.findFirst({
          where: { OR: [{ slug: item.category }, { name: item.category }] },
        });
        categoryId = cat?.id || null;
      }

      await prisma.product.create({
        data: {
          name: item.name,
          slug,
          description: item.description || null,
          price: Number(item.price),
          salePrice: item.salePrice ? Number(item.salePrice) : null,
          stock: Number(item.stock) || 0,
          categoryId,
          featured: item.featured === true || item.featured === "true",
          active: true,
        },
      });

      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push(`Lỗi tạo "${item.name}": ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return NextResponse.json(results);
}
