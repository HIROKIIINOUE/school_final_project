import { Prisma } from "../generated/prisma/client";
import { AppError } from "../lib/appError";
import { assertTripAccess } from "../lib/assertTripAccess";
import { prisma } from "../lib/prisma";
import {
  bookingSubtypeSchema,
  CreateBookingBody,
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

  // owner and member can both create booking => because not only the owner make reservation.
  const createData = { ...body, tripId, createdById: userId };
  const createdBooking = await prisma.booking.create({ data: createData });
  return createdBooking;
}

async function updateBooking({
  userId,
  tripId,
  body,
}: {
  userId: string;
  tripId: string;
  body: "";
}) {}

export { getBookings, createBooking, updateBooking };
