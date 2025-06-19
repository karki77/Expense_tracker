/*
  Warnings:

  - You are about to drop the column `totalIncome` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "totalIncome",
ADD COLUMN     "totalIncomes" DOUBLE PRECISION NOT NULL DEFAULT 0;
