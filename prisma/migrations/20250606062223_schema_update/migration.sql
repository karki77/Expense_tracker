/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstname` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");
