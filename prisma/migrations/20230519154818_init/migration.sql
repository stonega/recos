-- CreateTable
CREATE TABLE "Credit" (
    "id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "credit" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Credit_userId_idx" ON "Credit"("userId");
