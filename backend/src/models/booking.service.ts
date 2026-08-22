import { Prisma } from "../generated/prisma/client";
import { AppError } from "../lib/appError";
import { assertTripAccess } from "../lib/assertTripAccess";
import { prisma } from "../lib/prisma";
import {
  bookingSubtypeSchema,
  CreateBookingBody,
  UpdateBookingBody,
} from "../schemas/bookings.schema";

type CreateBookingParams = {
  userId: string;
  tripId: string;
  body: CreateBookingBody;
};

const bookingSelect = {
  id: true,
  tripId: true,
  createdById: true,
  type: true,
  title: true,
  provider: true,
  confirmationCode: true,
  startTime: true,
  endTime: true,
  note: true,
  details: true,

  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BookingSelect;

async function getBookings({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  await assertTripAccess({ userId, tripId });

  const bookings = await prisma.booking.findMany({
    where: { tripId },
    select: bookingSelect,
    orderBy: [
      { startTime: { sort: "asc", nulls: "last" } },
      { createdAt: "asc" },
      { id: "asc" },
    ],
  });

  // you want to validate: if booking.type === "FLIGHT", booking.detals must look like FlightDetals
  const validatedBookings = bookings.map((booking) => {
    const result = bookingSubtypeSchema.safeParse({
      type: booking.type,
      details: booking.details,
    });
    if (!result.success) {
      throw new AppError(
        500,
        "INVALID_BOOKING_DATA",
        "Stored booking data is invalid",
      );
    }

    // result.data = {
    //   type: "FLIGHT",
    //   details: {
    //     flightNumber: "AC001",
    //     departureAirport: "YVR",
    //     arrivalAirport: "HND",
    //   },
    // };
    // Basically replacing type and details with validated one
    return { ...booking, ...result.data };
  });

  return validatedBookings;
}

async function createBooking({ userId, tripId, body }: CreateBookingParams) {
  // check membership => a logged in user has to belong in the trip.
  await assertTripAccess({ tripId, userId });

  if (
    body.startTime !== undefined &&
    body.startTime !== null &&
    body.endTime !== undefined &&
    body.endTime !== null
  ) {
    const startTime = new Date(body.startTime);
    const endTime = new Date(body.endTime);

    if (startTime > endTime) {
      throw new AppError(
        400,
        "INVALID_BOOKING_DATE_RANGE",
        "End time cannot be before start time.",
      );
    }
  }

  // owner and member can both create booking => because not only the owner make reservation.
  const createData = { ...body, tripId, createdById: userId };
  const createdBooking = await prisma.booking.create({ data: createData });
  return createdBooking;
}

async function updateBooking({
  userId,
  tripId,
  bookingId,
  body,
}: {
  userId: string;
  tripId: string;
  bookingId: string;
  body: UpdateBookingBody;
}) {
  await assertTripAccess({ userId, tripId });

  // fetch existing booking
  const existingBooking = await prisma.booking.findFirst({
    where: { tripId, id: bookingId },
    select: bookingSelect,
  });

  if (!existingBooking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking was not found");
  }

  // validation:
  // if requested body changes type, then details must be required
  if (
    body.type !== undefined &&
    body.type !== existingBooking.type &&
    body.details === undefined
  ) {
    throw new AppError(
      400,
      "INVALID_BOOKING_UPDATE",
      "Changing booking type requires details.",
    );
  }

  // if type was provided, set the next type to it, if not provided, set the already-existing type
  const nextType = body.type !== undefined ? body.type : existingBooking.type;
  const nextDetails =
    body.details !== undefined ? body.details : existingBooking.details;

  // we validate against this newly set type and details: if type === "FLIGHT", details must be flightDetails...
  const validationResult = bookingSubtypeSchema.safeParse({
    type: nextType,
    details: nextDetails,
  });

  const subtypeStateChangedByRequest =
    body.details !== undefined ||
    (body.type !== undefined && body.type !== existingBooking.type);

  if (!validationResult.success) {
    if (subtypeStateChangedByRequest) {
      throw new AppError(400, "INVALID_BOOKING_UPDATE", "Invalid update body");
    }

    throw new AppError(
      500,
      "INVALID_BOOKING_DATA",
      "Stored booking data is invalid",
    );
  }

  const updateData: Prisma.BookingUpdateInput = {};

  // if each field was provided
  if (body.title !== undefined) {
    updateData.title = body.title;
  }
  if (body.provider !== undefined) {
    updateData.provider = body.provider;
  }
  if (body.confirmationCode !== undefined) {
    updateData.confirmationCode = body.confirmationCode;
  }
  if (body.startTime !== undefined) {
    updateData.startTime = body.startTime;
  }
  if (body.endTime !== undefined) {
    updateData.endTime = body.endTime;
  }
  if (body.note !== undefined) {
    updateData.note = body.note;
  }
  if (body.type !== undefined) {
    updateData.type = validationResult.data.type;
  }
  if (body.details !== undefined) {
    updateData.details = validationResult.data.details;
  }

  const startTime =
    body.startTime === undefined
      ? existingBooking.startTime
      : body.startTime === null
        ? null
        : new Date(body.startTime);
  const endTime =
    body.endTime === undefined
      ? existingBooking.endTime
      : body.endTime === null
        ? null
        : new Date(body.endTime);

  if (startTime !== null && endTime !== null && startTime > endTime) {
    throw new AppError(
      400,
      "INVALID_BOOKING_DATE_RANGE",
      "End time cannot be before start time.",
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: existingBooking.id },
    data: updateData,
    select: bookingSelect,
  });

  const updatedSubtypeValidation = bookingSubtypeSchema.safeParse({
    type: updatedBooking.type,
    details: updatedBooking.details,
  });

  if (!updatedSubtypeValidation.success) {
    throw new AppError(
      500,
      "INVALID_BOOKING_DATA",
      "Stored booking data is invalid",
    );
  }

  return { ...updatedBooking, ...updatedSubtypeValidation.data };
}

async function deleteBooking({
  userId,
  tripId,
  bookingId,
}: {
  userId: string;
  tripId: string;
  bookingId: string;
}) {
  await assertTripAccess({ userId, tripId });

  const result = await prisma.booking.deleteMany({
    where: { id: bookingId, tripId },
  });

  if (result.count === 0) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking was not found.");
  }

  return { bookingId };
}

export { getBookings, createBooking, updateBooking, deleteBooking };
