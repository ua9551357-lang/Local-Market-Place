-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "platformName" TEXT NOT NULL DEFAULT 'LocalMarket',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@localmarket.com',
    "contactNumber" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Karachi',
    "currency" TEXT NOT NULL DEFAULT 'PKR (Pakistani Rupee)',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
