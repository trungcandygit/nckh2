import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) return NextResponse.json({ error: "Không tìm thấy danh mục" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, slug, icon } = body;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Không tìm thấy danh mục" }, { status: 404 });

  if (slug && slug !== existing.slug) {
    const dup = await prisma.category.findFirst({ where: { slug, NOT: { id } } });
    if (dup) return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: name || existing.name,
      slug: slug || existing.slug,
      icon: icon !== undefined ? icon : existing.icon,
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Không thể xóa danh mục đang có ${productCount} sản phẩm` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
