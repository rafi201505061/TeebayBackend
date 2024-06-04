/*
  Warnings:

  - Changed the type of `acquisitionStart` on the `AcquisitionHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `acquisitionEnd` on the `AcquisitionHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AcquisitionHistory" DROP COLUMN "acquisitionStart",
ADD COLUMN     "acquisitionStart" INTEGER NOT NULL,
DROP COLUMN "acquisitionEnd",
ADD COLUMN     "acquisitionEnd" INTEGER NOT NULL;
