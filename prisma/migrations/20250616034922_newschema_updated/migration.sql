/*
  Warnings:

  - Added the required column `name` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "name" TEXT NOT NULL;
