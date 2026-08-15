-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('FLIGHT', 'HOTEL', 'ACTIVITY', 'TRANSPORT', 'OTHER');

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "type" "BookingType" NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT,
    "confirmation_code" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "note" TEXT,
    "details" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bookings_trip_id_start_time_idx" ON "bookings"("trip_id", "start_time");

-- CreateIndex
CREATE INDEX "bookings_created_by_id_idx" ON "bookings"("created_by_id");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
