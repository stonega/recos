/*
  Warnings:

  - You are about to drop the column `result` on the `Result` table. All the data in the column will be lost.
  - Added the required column `end_timestamp` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_timestamp` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_id` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "result",
ADD COLUMN     "end_timestamp" TEXT NOT NULL,
ADD COLUMN     "start_timestamp" TEXT NOT NULL,
ADD COLUMN     "task_id" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
