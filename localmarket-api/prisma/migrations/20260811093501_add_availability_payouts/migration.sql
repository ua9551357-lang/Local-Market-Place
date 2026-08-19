-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- CreateEnum
CREATE TYPE "PayoutMethodType" AS ENUM ('bank', 'jazzcash', 'easypaisa');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('pending', 'completed', 'failed');

-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "acceptingBookings" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "advanceBookingDays" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "bufferTimeMins" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "acceptingBookings" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "advanceBookingDays" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "bufferTimeMins" INTEGER NOT NULL DEFAULT 30;

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_methods" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "type" "PayoutMethodType" NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payout_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "payoutMethodId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "availability_slots_providerId_day_key" ON "availability_slots"("providerId", "day");

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_methods" ADD CONSTRAINT "payout_methods_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_payoutMethodId_fkey" FOREIGN KEY ("payoutMethodId") REFERENCES "payout_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
