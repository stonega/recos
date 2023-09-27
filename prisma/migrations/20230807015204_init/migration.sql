/*
  Warnings:

  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Result";

-- CreateTable
CREATE TABLE "Subtitle" (
    "id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "task_id" TEXT NOT NULL,
    "subtitle_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "start_timestamp" TEXT NOT NULL,
    "end_timestamp" TEXT NOT NULL,

    CONSTRAINT "Subtitle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subtitle_id_idx" ON "Subtitle"("id");
