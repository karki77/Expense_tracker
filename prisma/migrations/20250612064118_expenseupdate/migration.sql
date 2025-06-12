/*
  Warnings:

  - You are about to drop the column `isRecurring` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `recurringInterval` on the `expenses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "isRecurring",
DROP COLUMN "recurringInterval";
