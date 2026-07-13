import { prisma } from "../lib/prisma";

async function getTripDetails({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  await prisma.trip.findMany({ where: {} });
}
