import Link from "next/link";
import { Store, Phone, Mail } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function ShopeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#212121] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#EE4D2D] rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TINORI</span>
            </div>
            <p className="text-[#9E9E9E] text-sm leading-relaxed">
              Shop thời trang & phụ kiện online. Hàng chất lượng, giá hợp lý,
              giao hàng nhanh toàn quốc.
            </p>
            <div className="flex gap-2 mt-4">
              <a
                href="https://www.facebook.com/tinori.official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#1877F2] rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://shopee.vn/tinori"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#EE4D2D] rounded-lg flex items-center justify-center hover:bg-[#D73211] transition-colors"
                aria-label="Shopee"
              >
                <ShopeeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm text-[#9E9E9E]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-white transition-colors">
                  Tra cứu đơn hàng
                </Link>
              </li>
              <li>
                <a
                  href="https://shopee.vn/tinori"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Shopee của chúng tôi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-[#9E9E9E]">
              <li className="flex items-center gap-2">
                <FacebookIcon className="h-4 w-4 text-[#1877F2] flex-shrink-0" />
                <a
                  href="https://www.facebook.com/tinori.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  facebook.com/tinori.official
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#00AB56] flex-shrink-0" />
                <span>Liên hệ qua Facebook</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#EE4D2D] flex-shrink-0" />
                <span>Inbox fanpage để được hỗ trợ</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-[#FF8C00]/10 border border-[#FF8C00]/30 rounded-lg">
              <p className="text-xs text-[#FF8C00] font-medium">
                Cần đặt cọc 25.000đ để xác nhận đơn hàng
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-[#9E9E9E]">
          <p>© 2024 Tinori. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
