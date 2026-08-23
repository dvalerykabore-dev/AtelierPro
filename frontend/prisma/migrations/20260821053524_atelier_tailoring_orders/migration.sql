-- CreateTable
CREATE TABLE "TailoringOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "garment" TEXT NOT NULL,
    "fabric" TEXT,
    "color" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "priceAmount" INTEGER NOT NULL,
    "depositAmount" INTEGER NOT NULL DEFAULT 0,
    "assignee" TEXT,
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "TailoringOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TailoringOrder_userId_createdAt_idx" ON "TailoringOrder"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "TailoringOrder_userId_status_idx" ON "TailoringOrder"("userId", "status");

-- CreateIndex
CREATE INDEX "TailoringOrder_customerId_createdAt_idx" ON "TailoringOrder"("customerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TailoringOrder_userId_sequence_key" ON "TailoringOrder"("userId", "sequence");

-- AddForeignKey
ALTER TABLE "TailoringOrder" ADD CONSTRAINT "TailoringOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TailoringOrder" ADD CONSTRAINT "TailoringOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
