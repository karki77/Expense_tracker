/*
  Warnings:

  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "profile" TEXT;

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalBudget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyBudget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isOverBudget" BOOLEAN NOT NULL DEFAULT false,
    "isUnderBudget" BOOLEAN NOT NULL DEFAULT false,
    "isOnBudget" BOOLEAN NOT NULL DEFAULT false,
    "topExpenses" JSONB,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
