/*
  Warnings:

  - Made the column `name` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "name" SET NOT NULL;
