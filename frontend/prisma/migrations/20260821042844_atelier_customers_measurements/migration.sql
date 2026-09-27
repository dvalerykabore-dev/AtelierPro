-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "gender" TEXT NOT NULL,
    "loyal" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementSet" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "values" JSONB NOT NULL,
    "notes" TEXT,
    "fabricPhotos" JSONB,
    "modelPhoto" TEXT,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeasurementSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Customer_userId_createdAt_idx" ON "Customer"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_name_key" ON "Customer"("userId", "name");

-- CreateIndex
CREATE INDEX "MeasurementSet_customerId_takenAt_idx" ON "MeasurementSet"("customerId", "takenAt");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementSet" ADD CONSTRAINT "MeasurementSet_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
