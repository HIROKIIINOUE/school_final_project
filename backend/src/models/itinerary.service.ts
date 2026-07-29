import { AppError } from "../lib/appError";
import { prisma } from "../lib/prisma";
import {
  ItineraryItemInput,
  UpdateItineraryInput,
} from "../schemas/trips.schema";
import { SaveItineraryItemInput } from "../types/itinerary.types";

async function getItinerary({
  tripId,
  userId,
}: {
  tripId: string;
  userId: string;
}) {
  // check if the user belongs in this trip
  const membership = await prisma.tripMember.findFirst({
    where: { userId, tripId },
    select: { id: true },
  });
  if (!membership) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

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
    orderBy: { startTime: "asc" },
  });

  return itineraryItems.map((itinerary) => {
    return {
      id: itinerary.id,
      title: itinerary.title,
      detail: itinerary.detail ?? null,
      location: itinerary.location ?? null,
      startTime: new Date(itinerary.startTime),
      isCreatedByCurrentUser: itinerary.createdById === userId,
    };
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
  // check if the user belongs in this trip
  const membership = await prisma.tripMember.findFirst({
    where: { userId, tripId },
    select: { id: true },
  });
  if (!membership) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

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

async function updateItinerary({
  tripId,
  userId,
  itineraries,
}: {
  tripId: string;
  userId: string;
  itineraries: UpdateItineraryInput[];
}) {
  // if id is provied, it's the data to update
  type ExistingItineraryItemInput = SaveItineraryItemInput & { id: string };

  const itemsToUpdate = itineraries.filter(
    (item): item is ExistingItineraryItemInput => typeof item.id === "string",
  );

  // if id is not provied, that's the data to add newly
  const itemsToAdd = itineraries.filter((item) => !item.id);

  const submittedIds = itemsToUpdate.map((item) => item.id);

  const submittedExistingIds = itineraries
    .map((item) => item.id)
    .filter((id) => id !== undefined);

  const upsertedResults = await prisma.$transaction(async (tx) => {
    // check if the user belongs to this trip
    const membership = await tx.tripMember.findFirst({
      where: { tripId, userId },
      select: { id: true },
    });

    if (!membership) {
      throw new AppError(
        403,
        "TRIP_ACCESS_DENIED",
        "You do not have access to this trip.",
      );
    }

    // check if the passed id is valid = try to find and can't find === invalid id
    const existingItems =
      submittedIds.length === 0
        ? []
        : await tx.itineraryItem.findMany({
            where: { tripId, id: { in: submittedIds } },
            select: { id: true },
          });

    const existingIds = new Set(existingItems.map((item) => item.id));

    const invalidIds = submittedIds.filter((id) => !existingIds.has(id));

    if (invalidIds.length > 0) {
      throw new AppError(
        400,
        "INVALID_ITINERARY_ITEM_IDS",
        "One or more itinerary items do not belong to this trip.",
      );
    }

    const allExistingItems = await tx.itineraryItem.findMany({
      where: { tripId },
      select: { id: true },
    });
    const submittedIdSet = new Set(submittedIds);
    const omittedIds = allExistingItems
      .map((item) => item.id)
      .filter((id) => !submittedIdSet.has(id));

    await tx.itineraryItem.deleteMany({
      where: { tripId, id: { in: omittedIds } },
    });

    const updateOperations = itemsToUpdate.map((item) =>
      tx.itineraryItem.update({
        where: { id: item.id },
        data: {
          title: item.title,
          detail: item.detail ?? null,
          location: item.location ?? null,
          startTime: new Date(item.startTime),
        },
      }),
    );

    const createOperations = itemsToAdd.map((item) =>
      tx.itineraryItem.create({
        data: {
          tripId,
          createdById: userId,
          title: item.title,
          detail: item.detail ?? null,
          location: item.location ?? null,
          startTime: new Date(item.startTime),
        },
      }),
    );

    await Promise.all([...updateOperations, ...createOperations]);

    return tx.itineraryItem.findMany({
      where: { tripId },
      select: {
        id: true,
        createdById: true,
        title: true,
        detail: true,
        location: true,
        startTime: true,
      },
      orderBy: { startTime: "asc" },
    });
  });

  return upsertedResults;
}

export { getItinerary, createItinerary, updateItinerary };
