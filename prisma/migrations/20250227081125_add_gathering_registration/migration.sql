-- CreateTable
CREATE TABLE "GatheringRegistration" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "gatheringId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GatheringRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GatheringRegistration_memberId_gatheringId_key" ON "GatheringRegistration"("memberId", "gatheringId");

-- AddForeignKey
ALTER TABLE "GatheringRegistration" ADD CONSTRAINT "GatheringRegistration_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GatheringRegistration" ADD CONSTRAINT "GatheringRegistration_gatheringId_fkey" FOREIGN KEY ("gatheringId") REFERENCES "Gathering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
