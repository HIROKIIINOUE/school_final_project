import { prisma } from "../lib/prisma";
import { ItineraryItemInput } from "../schemas/trips.schema";

async function getItinerary({
  tripId,
  userId,
}: {
  tripId: string;
  userId: string;
}) {
  const itineraryItems = await prisma.itineraryItem.findMany({
    where: { tripId },
    select: {
      id: true,
      createdById: true,
      title: true,
      detail: true,
      location: true,
      startTime: true,
    },
    orderBy: { startTime: "desc" },
  });

  return itineraryItems.map((itinerary) => {
    return { ...itinerary, isOwner: itinerary.createdById === userId };
  });
}

async function createItinerary({
  tripId,
  userId,
  itineraries,
}: {
  tripId: string;
  userId: string;
  itineraries: ItineraryItemInput[];
}) {
  // accept arrays of itineraries items
  const passingData = itineraries.map((itinerary) => {
    return {
      tripId,
      createdById: userId,
      title: itinerary.title,
      detail: itinerary.detail ?? null,
      location: itinerary.location ?? null,
      startTime: new Date(itinerary.startTime ?? ""),
    };
  });

  const result = await prisma.itineraryItem.createManyAndReturn({
    data: passingData,
    select: {
      id: true,
      title: true,
      detail: true,
      location: true,
      startTime: true,
    },
  });

  return result;
}

export { getItinerary, createItinerary };
