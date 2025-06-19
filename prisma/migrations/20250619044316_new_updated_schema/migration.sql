/*
  Warnings:

  - You are about to drop the column `totalBudget` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "totalBudget",
ADD COLUMN     "totalIncome" DOUBLE PRECISION NOT NULL DEFAULT 0;
