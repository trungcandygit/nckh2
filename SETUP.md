# Tinori Shop - Hướng dẫn cài đặt

## Yêu cầu
- Node.js 18+
- Git

## Cài đặt

```bash
# Clone project
git clone https://github.com/trungcandygit/nckh2.git
cd nckh2

# Checkout branch
git checkout claude/facebook-shop-website-ExIcm

# Cài dependencies
npm install

# Copy env
cp .env.example .env

# Tạo database và seed data (admin + sản phẩm mẫu)
npx tsx prisma/seed.ts

# Chạy dev server
npm run dev
```

Mở http://localhost:3000

**Admin:** http://localhost:3000/admin/login
- Email: admin@tinori.vn
- Password: tinori@2024
