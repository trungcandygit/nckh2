"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";
import { formatPrice } from "@/lib/utils";

interface ParsedProduct {
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  description?: string;
  category?: string;
  featured: boolean;
}

function parseCSV(text: string): ParsedProduct[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
  const products: ParsedProduct[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields with commas
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });

    if (!row.name || !row.price) continue;

    products.push({
      name: row.name,
      price: Number(row.price) || 0,
      salePrice: row.saleprice ? Number(row.saleprice) : undefined,
      stock: Number(row.stock) || 0,
      description: row.description || "",
      category: row.category || "",
      featured: row.featured === "true" || row.featured === "1",
    });
  }

  return products;
}

export default function BulkImportForm() {
  const [preview, setPreview] = useState<ParsedProduct[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setPreview(parsed);
      if (parsed.length === 0) {
        toast({ title: "Không đọc được dữ liệu", description: "Kiểm tra định dạng CSV", variant: "destructive" });
      } else {
        toast({ title: `Đọc được ${parsed.length} sản phẩm`, variant: "success" });
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    setImporting(true);
    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: preview }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success > 0) {
        toast({ title: `Import thành công ${data.success} sản phẩm`, variant: "success" });
        setPreview([]);
        setFileName("");
      }
    } catch {
      toast({ title: "Lỗi import", variant: "destructive" });
    }
    setImporting(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Format guide */}
      <div className="bg-[#FFF0ED] border border-[#EE4D2D]/20 rounded-lg p-4">
        <h3 className="font-semibold text-[#212121] mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#EE4D2D]" />
          Định dạng CSV
        </h3>
        <pre className="text-xs text-[#616161] bg-white p-3 rounded border border-[#E0E0E0] overflow-x-auto">
{`name,price,salePrice,stock,description,category,featured
Áo thun basic,150000,120000,50,"Áo thun thoải mái",ao-thun,true
Quần jean slim,250000,,30,"Quần jean cao cấp",quan-jean,false`}
        </pre>
        <p className="text-xs text-[#9E9E9E] mt-2">
          Cột bắt buộc: <strong>name</strong>, <strong>price</strong>. Các cột còn lại tùy chọn.
        </p>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <label className="flex flex-col items-center justify-center gap-3 w-full h-36 border-2 border-dashed border-[#E0E0E0] rounded-lg cursor-pointer hover:border-[#EE4D2D] hover:bg-[#FFF0ED]/30 transition-colors">
          <Upload className="h-8 w-8 text-[#9E9E9E]" />
          <div className="text-center">
            <p className="text-sm font-medium text-[#212121]">
              {fileName ? fileName : "Chọn file CSV"}
            </p>
            <p className="text-xs text-[#9E9E9E]">Định dạng .csv, encoding UTF-8</p>
          </div>
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E0E0E0]">
            <h3 className="font-semibold text-[#212121]">
              Preview — {preview.length} sản phẩm
            </h3>
            <Button onClick={handleImport} disabled={importing}>
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang import...
                </>
              ) : (
                `Import tất cả (${preview.length})`
              )}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-[#616161]">Tên</th>
                  <th className="text-right px-4 py-2 font-medium text-[#616161]">Giá</th>
                  <th className="text-right px-4 py-2 font-medium text-[#616161]">Giá sale</th>
                  <th className="text-center px-4 py-2 font-medium text-[#616161]">Kho</th>
                  <th className="text-left px-4 py-2 font-medium text-[#616161]">Danh mục</th>
                  <th className="text-center px-4 py-2 font-medium text-[#616161]">Nổi bật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {preview.slice(0, 20).map((p, i) => (
                  <tr key={i} className="hover:bg-[#FAFAFA]">
                    <td className="px-4 py-2 text-[#212121]">{p.name}</td>
                    <td className="px-4 py-2 text-right text-[#EE4D2D] font-medium">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-2 text-right text-[#9E9E9E]">
                      {p.salePrice ? formatPrice(p.salePrice) : "-"}
                    </td>
                    <td className="px-4 py-2 text-center">{p.stock}</td>
                    <td className="px-4 py-2 text-[#616161]">{p.category || "-"}</td>
                    <td className="px-4 py-2 text-center">
                      {p.featured ? "✓" : "-"}
                    </td>
                  </tr>
                ))}
                {preview.length > 20 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center text-[#9E9E9E] text-xs">
                      ... và {preview.length - 20} sản phẩm khác
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 space-y-2">
          <h3 className="font-semibold text-[#212121]">Kết quả import</h3>
          {result.success > 0 && (
            <div className="flex items-center gap-2 text-[#00AB56]">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Thành công: {result.success} sản phẩm</span>
            </div>
          )}
          {result.failed > 0 && (
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="h-4 w-4" />
              <span className="text-sm">Thất bại: {result.failed} sản phẩm</span>
            </div>
          )}
          {result.errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-500">• {e}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
