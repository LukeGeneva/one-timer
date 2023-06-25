-- CreateTable
CREATE TABLE "Secret" (
    "id" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "initializationVector" TEXT NOT NULL,

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);
