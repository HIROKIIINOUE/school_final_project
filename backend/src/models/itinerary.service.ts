import { Prisma } from "../generated/prisma/client";
import { AppError } from "../lib/appError";
import { assertTripAccess } from "../lib/assertTripAccess";
import { prisma } from "../lib/prisma";
import { bookingSubtypeSchema } from "../schemas/bookings.schema";
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
    data: { tripId, createdById: userId, ...itineraryData(input) },
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
      where: { id: itemId, tripId, updatedAt: new Date(expectedUpdatedAt) },
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
      where: { id: itemId, tripId, updatedAt: new Date(expectedUpdatedAt) },
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

async function createItineraryBasedOnBooking({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  // validates user and tripId
  await assertTripAccess({ tripId, userId });

  // get booking info first
  const existingBookings = await prisma.booking.findMany({
    where: { tripId },
    select: {
      id: true,
      type: true,
      title: true,
      startTime: true,
      details: true,
    },
  });

  if (existingBookings.length === 0) {
    // front needs to know there was no booking info to genereate itineraries
    return [];
  }

  // create an array of itinerary data
  const shapedItineraries = existingBookings.map(
    (booking): Prisma.ItineraryItemCreateManyInput | null => {
      // if start time is null, won't add that booking to itinerary, so skip
      if (!booking.startTime) return null;
      // if the booking is other, won't add that too, so skip it
      if (booking.type === "OTHER") return null;

      const validatedBooking = bookingSubtypeSchema.parse({
        type: booking.type,
        details: booking.details,
      });

      switch (validatedBooking.type) {
        case "FLIGHT":
          return {
            tripId,
            createdById: userId,
            title: booking.title,
            detail: `Flight ${validatedBooking.details.flightNumber} : ${validatedBooking.details.departureAirport} to ${validatedBooking.details.arrivalAirport}`,
            location: validatedBooking.details.departureAirport,
            startTime: booking.startTime,
            sourceBookingId: booking.id,
          };
        case "HOTEL":
          return {
            tripId,
            createdById: userId,
            title: booking.title,
            detail: `Stay at ${validatedBooking.details.address ?? " - "}`,
            location: validatedBooking.details.address ?? null,
            startTime: booking.startTime,
            sourceBookingId: booking.id,
          };
        case "ACTIVITY":
          return {
            tripId,
            createdById: userId,
            title: booking.title,
            detail: `${validatedBooking.details.activityType ?? ""} Meet up: ${validatedBooking.details.meetingPoint ?? " - "}`,
            location:
              validatedBooking.details.meetingPoint ??
              validatedBooking.details.location ??
              null,
            startTime: booking.startTime,
            sourceBookingId: booking.id,
          };
        case "TRANSPORT":
          return {
            tripId,
            createdById: userId,
            title: booking.title,
            detail: `Transport Type: ${validatedBooking.details.transportType ?? " - "}. Departure: ${validatedBooking.details.departureLocation ?? " - "} to ${validatedBooking.details.arrivalLocation ?? " - "}`,
            location: validatedBooking.details.departureLocation || null,
            startTime: booking.startTime,
            sourceBookingId: booking.id,
          };
      }
    },
  );

  const addItineraryData = shapedItineraries.filter(
    (itinerary): itinerary is Prisma.ItineraryItemCreateManyInput =>
      itinerary !== null,
  );

  const createdItineraries = await prisma.itineraryItem.createManyAndReturn({
    data: addItineraryData,
    skipDuplicates: true,
    select: itineraryItemSelect,
  });

  return createdItineraries.map((item) => serializeItineraryItem(item, userId));
}

export {
  createItineraryItem,
  deleteItineraryItem,
  getItinerary,
  updateItineraryItem,
  createItineraryBasedOnBooking,
};
