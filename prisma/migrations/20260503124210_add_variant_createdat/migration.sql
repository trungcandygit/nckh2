-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product_variants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "price" REAL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_product_variants" ("id", "name", "price", "productId", "stock", "type", "value") SELECT "id", "name", "price", "productId", "stock", "type", "value" FROM "product_variants";
DROP TABLE "product_variants";
ALTER TABLE "new_product_variants" RENAME TO "product_variants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
