-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifySms" BOOLEAN NOT NULL DEFAULT true;
