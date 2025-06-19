/*
  Warnings:

  - You are about to drop the column `monthlyBudget` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "monthlyBudget",
ADD COLUMN     "monthlyIncomes" DOUBLE PRECISION NOT NULL DEFAULT 0;
