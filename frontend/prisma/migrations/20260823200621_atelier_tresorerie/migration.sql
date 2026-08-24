-- CreateTable
CREATE TABLE "CashMovement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "occurredAt" DATE NOT NULL,
    "category" TEXT,
    "method" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "notes" TEXT,
    "tailoringOrderId" TEXT,
    "backfilled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringCharge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "dayOfMonth" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringCharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CashMovement_userId_occurredAt_idx" ON "CashMovement"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "CashMovement_userId_direction_occurredAt_idx" ON "CashMovement"("userId", "direction", "occurredAt");

-- CreateIndex
CREATE INDEX "CashMovement_tailoringOrderId_idx" ON "CashMovement"("tailoringOrderId");

-- CreateIndex
CREATE INDEX "RecurringCharge_userId_active_idx" ON "RecurringCharge"("userId", "active");

-- AddForeignKey
ALTER TABLE "CashMovement" ADD CONSTRAINT "CashMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashMovement" ADD CONSTRAINT "CashMovement_tailoringOrderId_fkey" FOREIGN KEY ("tailoringOrderId") REFERENCES "TailoringOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringCharge" ADD CONSTRAINT "RecurringCharge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
