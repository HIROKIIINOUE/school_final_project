import { assertTripAccess } from "../lib/assertTripAccess";
import { prisma } from "../lib/prisma";
import { CreateBookingBody } from "../schemas/bookings.schema";

type CreateBookingParams = {
  userId: string;
  tripId: string;
  body: CreateBookingBody;
};

async function createBooking({ userId, tripId, body }: CreateBookingParams) {
  // check membership => a logged in user has to belong in the trip.
  await assertTripAccess({ tripId, userId });

  // owner and member can both create booking => because not only the owner make reservation.
  const createData = { tripId, createdById: userId, ...body };
  const createdBooking = await prisma.booking.create({ data: createData });
  return createdBooking;
}

export { createBooking };
