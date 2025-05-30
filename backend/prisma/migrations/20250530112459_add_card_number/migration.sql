/*
  Warnings:

  - You are about to drop the column `cardLast4` on the `Order` table. All the data in the column will be lost.
  - Added the required column `cardNumber` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cardLast4",
ADD COLUMN     "cardNumber" TEXT NOT NULL;
