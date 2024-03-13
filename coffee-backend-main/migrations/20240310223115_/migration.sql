/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `Basket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Basket_userId_productId_key" ON "Basket"("userId", "productId");
