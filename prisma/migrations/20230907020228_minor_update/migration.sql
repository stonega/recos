/*
  Warnings:

  - Made the column `lang` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lang" SET NOT NULL,
ALTER COLUMN "lang" SET DEFAULT 'en-US';
