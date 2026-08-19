import { grabAccessToken } from "@/lib/getAccessToken";
import {
  CreateBookingBody,
  CreatedBooking,
  DeletedBooking,
  GetBookings,
  UpdateBookingBody,
  UpdatedBooking,
} from "../types/types";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

type ApiRes<T> = { data: T };

function generateBookingRoute({
  tripId,
  bookingId,
}: {
  tripId: string;
  bookingId?: string;
}) {
  const baseUrl = `${BACKEND_URL}/api/trips/${tripId}/bookings`;
  return bookingId ? `${baseUrl}/${bookingId}` : baseUrl;
}

async function authorizationHeaders() {
  const accessToken = await grabAccessToken();
  return { Authorization: `Bearer ${accessToken}` };
}

export async function getBookings({ tripId }: { tripId: string }) {
  const authorization = await authorizationHeaders();
  const apiRoute = generateBookingRoute({ tripId });
  const res = await fetch(apiRoute, {
    method: "GET",
    headers: { ...authorization },
    credentials: "include",
  });
  const data: ApiRes<GetBookings> = await res.json();

  if (!res.ok) {
    console.error("res.ok failed. Failed to fetch  bookings", data);
    throw new Error("Failed to fetch bookings");
  }

  return data.data.bookings;
}

export async function createBooking({
  tripId,
  body,
}: {
  tripId: string;
  body: CreateBookingBody;
}) {
  const authorization = await authorizationHeaders();
  const apiRoute = generateBookingRoute({ tripId });
  const res = await fetch(apiRoute, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authorization },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data: ApiRes<CreatedBooking> = await res.json();

  if (!res.ok) {
    console.error("res.ok failed. Failed to create  bookings", data);
    throw new Error("Failed to create bookings");
  }

  return data.data.booking;
}

export async function updateBooking({
  tripId,
  bookingId,
  body,
}: {
  tripId: string;
  bookingId: string;
  body: UpdateBookingBody;
}) {
  const authorization = await authorizationHeaders();
  const apiRoute = generateBookingRoute({ tripId, bookingId });
  const res = await fetch(apiRoute, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authorization },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data: ApiRes<UpdatedBooking> = await res.json();

  if (!res.ok) {
    console.error("res.ok failed. Failed to update  bookings", data);
    throw new Error("Failed to update bookings");
  }

  return data.data.updatedBooking;
}

export async function deleteBooking({
  tripId,
  bookingId,
}: {
  tripId: string;
  bookingId: string;
}) {
  const authorization = await authorizationHeaders();
  const apiRoute = generateBookingRoute({ tripId, bookingId });
  const res = await fetch(apiRoute, {
    method: "DELETE",
    headers: { ...authorization },
  });

  const data: ApiRes<DeletedBooking> = await res.json();

  if (!res.ok) {
    console.error("Failed to delete booking: ", data);
    throw new Error("Failed to delete booking");
  }

  return data.data.deletedBooking;
}
