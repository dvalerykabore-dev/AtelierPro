-- CreateTable
CREATE TABLE "PriceItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "garment" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'façon',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tailoringOrderId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceItem_userId_idx" ON "PriceItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceItem_userId_garment_key" ON "PriceItem"("userId", "garment");

-- CreateIndex
CREATE INDEX "OrderNote_tailoringOrderId_createdAt_idx" ON "OrderNote"("tailoringOrderId", "createdAt");

-- AddForeignKey
ALTER TABLE "PriceItem" ADD CONSTRAINT "PriceItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderNote" ADD CONSTRAINT "OrderNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderNote" ADD CONSTRAINT "OrderNote_tailoringOrderId_fkey" FOREIGN KEY ("tailoringOrderId") REFERENCES "TailoringOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
