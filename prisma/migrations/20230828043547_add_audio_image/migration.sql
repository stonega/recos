/*
  Warnings:

  - You are about to drop the `Subtitle` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Credit" ADD COLUMN     "audio_image" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Subtitle";
