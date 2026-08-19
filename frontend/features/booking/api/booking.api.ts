import { CreateBookingBody, UpdateBookingBody } from "../types/types";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

async function getBookings({ tripId }: { tripId: string }) {
  const res = await fetch(`${BACKEND_URL}/api/trips/${tripId}/bookings`);
}

async function createBooking({
  tripId,
  body,
}: {
  tripId: string;
  body: CreateBookingBody;
}) {}

async function updateBooking({
  tripId,
  bookingId,
  body,
}: {
  tripId: string;
  bookingId: string;
  body: UpdateBookingBody;
}) {}
