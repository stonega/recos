/*
  Warnings:

  - You are about to drop the column `translateLanguage` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "translateLanguage",
ADD COLUMN     "lang" TEXT;
