-- CreateEnum
CREATE TYPE "AcquisitionType" AS ENUM ('BUY', 'RENT');

-- CreateTable
CREATE TABLE "AcquisitionHistory" (
    "id" SERIAL NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acquisitionType" "AcquisitionType" NOT NULL,
    "productId" INTEGER NOT NULL,
    "acquirerId" INTEGER NOT NULL,
    "acquisitionStart" TIMESTAMP(3) NOT NULL,
    "acquisitionEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcquisitionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcquisitionHistory" ADD CONSTRAINT "AcquisitionHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionHistory" ADD CONSTRAINT "AcquisitionHistory_acquirerId_fkey" FOREIGN KEY ("acquirerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
