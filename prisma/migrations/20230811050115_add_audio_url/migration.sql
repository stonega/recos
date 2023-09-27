-- DropIndex
DROP INDEX "Subtitle_id_idx";

-- AlterTable
ALTER TABLE "Credit" ADD COLUMN     "audio_url" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Subtitle_id_task_id_idx" ON "Subtitle"("id", "task_id");
