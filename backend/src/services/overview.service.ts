import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

async function getTripDetails({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  // find one trip which mathces with tripId
  // also check if userId is the member of the trip
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, members: { some: { userId } } },
    select: {
      id: true,
      ownerId: true,
      title: true,
      description: true,
      destination: true,
      startDate: true,
      endDate: true,
      members: { where: { userId: userId }, select: { role: true } },
    },
  });

  if (!trip) {
    throw new AppError(404, "TRIP_NOT_FOUND", "Trip was not found");
  }
  const planningStatus = getPlanningStatus({
    start: trip.startDate,
    end: trip.endDate,
  });
  return {
    id: trip.id,
    title: trip.title,
    description: trip.description,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    currentUserRole: trip.members[0].role,
    planningStatus,
  };
}

async function getItineraries({ tripId }: { tripId: string; userId: string }) {
  const itineraries = await prisma.itineraryItem.findMany({
    where: { tripId: tripId },
    select: {
      id: true,
      title: true,
      location: true,
      detail: true,
      startTime: true,
    },
    orderBy: { startTime: "desc" },
  });
}
