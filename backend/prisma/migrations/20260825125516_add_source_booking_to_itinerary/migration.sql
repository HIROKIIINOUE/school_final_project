/*
  Warnings:

  - A unique constraint covering the columns `[sourceBookingId]` on the table `ItineraryItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ItineraryItem" ADD COLUMN     "sourceBookingId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryItem_sourceBookingId_key" ON "ItineraryItem"("sourceBookingId");

-- AddForeignKey
ALTER TABLE "ItineraryItem" ADD CONSTRAINT "ItineraryItem_sourceBookingId_fkey" FOREIGN KEY ("sourceBookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
