-- CreateTable
CREATE TABLE "WorkshopTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignee" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "hours" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkshopTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkshopTask_userId_day_idx" ON "WorkshopTask"("userId", "day");

-- CreateIndex
CREATE INDEX "WorkshopTask_userId_assignee_day_idx" ON "WorkshopTask"("userId", "assignee", "day");

-- AddForeignKey
ALTER TABLE "WorkshopTask" ADD CONSTRAINT "WorkshopTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
