/*
  Warnings:

  - Made the column `clientMessageId` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `user_id` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExpenseSplitType" AS ENUM ('EQUAL', 'CUSTOM');

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "clientMessageId" SET NOT NULL;

-- AlterTable
-- ALTER TABLE "Profile" DROP COLUMN "user_id",
-- ADD COLUMN     "user_id" UUID NOT NULL;

ALTER TABLE "Profile"
ALTER COLUMN "user_id"
TYPE UUID
USING "user_id"::uuid;

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "paid_by_member_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT,
    "split_type" "ExpenseSplitType" NOT NULL DEFAULT 'EQUAL',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_splits" (
    "id" SERIAL NOT NULL,
    "expense_id" UUID NOT NULL,
    "trip_member_id" UUID NOT NULL,
    "owed_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_splits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "expenses_trip_id_idx" ON "expenses"("trip_id");

-- CreateIndex
CREATE INDEX "expenses_paid_by_member_id_idx" ON "expenses"("paid_by_member_id");

-- CreateIndex
CREATE INDEX "expense_splits_trip_member_id_idx" ON "expense_splits"("trip_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "expense_splits_expense_id_trip_member_id_key" ON "expense_splits"("expense_id", "trip_member_id");

-- CreateIndex

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_paid_by_member_id_fkey" FOREIGN KEY ("paid_by_member_id") REFERENCES "TripMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_splits" ADD CONSTRAINT "expense_splits_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_splits" ADD CONSTRAINT "expense_splits_trip_member_id_fkey" FOREIGN KEY ("trip_member_id") REFERENCES "TripMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
