/*
  Warnings:

  - You are about to drop the column `receipt` on the `expenses` table. All the data in the column will be lost.
  - Changed the type of `period` on the `budgets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `recurringInterval` to the `expenses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Period" AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "period",
ADD COLUMN     "period" "Period" NOT NULL;

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "receipt",
ADD COLUMN     "receiptUrl" TEXT,
DROP COLUMN "recurringInterval",
ADD COLUMN     "recurringInterval" "Period" NOT NULL;
