-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "status" "ProviderStatus" NOT NULL DEFAULT 'pending';
