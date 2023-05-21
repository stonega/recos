/*
  Warnings:

  - Added the required column `audio_length` to the `Credit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credit" ADD COLUMN     "audio_length" INTEGER NOT NULL;
