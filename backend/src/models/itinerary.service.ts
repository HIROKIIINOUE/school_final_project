import { AppError } from "../lib/appError";
import { prisma } from "../lib/prisma";
import { ItineraryItemInput } from "../schemas/trips.schema";

const itineraryItemSelect = {
  id: true,
  createdById: true,
  title: true,
  detail: true,
  location: true,
  startTime: true,
  updatedAt: true,
} as const;

async function assertTripAccess({
  tripId,
  userId,
}: {
  tripId: string;
  userId: string;
}) {
  const membership = await prisma.tripMember.findUnique({
    where: { tripId_userId: { tripId, userId } },
    select: { id: true },
  });

  if (!membership) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }
}

function serializeItineraryItem(
  item: {
    id: string;
    createdById: string;
    title: string;
    detail: string | null;
    location: string | null;
    startTime: Date;
    updatedAt: Date;
  },
  currentUserId: string,
) {
  return {
    id: item.id,
    title: item.title,
    detail: item.detail,
    location: item.location,
    startTime: item.startTime,
    updatedAt: item.updatedAt,
    isCreatedByCurrentUser: item.createdById === currentUserId,
  };
}

function itineraryData(input: ItineraryItemInput) {
  return {
    title: input.title,
    detail: input.detail ?? null,
    location: input.location ?? null,
    startTime: new Date(input.startTime),
  };
}

async function getItinerary({
  tripId,
  userId,
}: {
  tripId: string;
  userId: string;
}) {
  await assertTripAccess({ tripId, userId });

  const itineraryItems = await prisma.itineraryItem.findMany({
    where: { tripId },
    select: itineraryItemSelect,
    orderBy: { startTime: "asc" },
  });

  return itineraryItems.map((item) => serializeItineraryItem(item, userId));
}

async function createItineraryItem({
  tripId,
  userId,
  input,
}: {
  tripId: string;
  userId: string;
  input: ItineraryItemInput;
}) {
  await assertTripAccess({ tripId, userId });

  const item = await prisma.itineraryItem.create({
    data: {
      tripId,
      createdById: userId,
      ...itineraryData(input),
    },
    select: itineraryItemSelect,
  });

  return serializeItineraryItem(item, userId);
}

async function updateItineraryItem({
  tripId,
  itemId,
  userId,
  expectedUpdatedAt,
  input,
}: {
  tripId: string;
  itemId: string;
  userId: string;
  expectedUpdatedAt: string;
  input: ItineraryItemInput;
}) {
  await assertTripAccess({ tripId, userId });

  const item = await prisma.$transaction(async (tx) => {
    const result = await tx.itineraryItem.updateMany({
      where: {
        id: itemId,
        tripId,
        updatedAt: new Date(expectedUpdatedAt),
      },
      data: itineraryData(input),
    });

    if (result.count === 0) {
      const itemExists = await tx.itineraryItem.findFirst({
        where: { id: itemId, tripId },
        select: { id: true },
      });

      if (!itemExists) {
        throw new AppError(
          404,
          "ITINERARY_ITEM_NOT_FOUND",
          "The itinerary item was not found.",
        );
      }

      throw new AppError(
        409,
        "ITINERARY_CONFLICT",
        "This itinerary item was changed by another member. Refresh and try again.",
      );
    }

    return tx.itineraryItem.findUnique({
      where: { id: itemId },
      select: itineraryItemSelect,
    });
  });

  if (!item) {
    throw new AppError(
      404,
      "ITINERARY_ITEM_NOT_FOUND",
      "The itinerary item was not found.",
    );
  }

  return serializeItineraryItem(item, userId);
}

async function deleteItineraryItem({
  tripId,
  itemId,
  userId,
  expectedUpdatedAt,
}: {
  tripId: string;
  itemId: string;
  userId: string;
  expectedUpdatedAt: string;
}) {
  await assertTripAccess({ tripId, userId });

  await prisma.$transaction(async (tx) => {
    const result = await tx.itineraryItem.deleteMany({
      where: {
        id: itemId,
        tripId,
        updatedAt: new Date(expectedUpdatedAt),
      },
    });

    if (result.count > 0) return;

    const itemExists = await tx.itineraryItem.findFirst({
      where: { id: itemId, tripId },
      select: { id: true },
    });

    if (!itemExists) {
      throw new AppError(
        404,
        "ITINERARY_ITEM_NOT_FOUND",
        "The itinerary item was not found.",
      );
    }

    throw new AppError(
      409,
      "ITINERARY_CONFLICT",
      "This itinerary item was changed by another member. Refresh and try again.",
    );
  });
}

export {
  createItineraryItem,
  deleteItineraryItem,
  getItinerary,
  updateItineraryItem,
};
