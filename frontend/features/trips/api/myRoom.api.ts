import { createMyRoomsInput } from "../types/types";

const backendUrl = process.env.BACKEND_URL;

export async function fetchMyRooms() {
  const res = await fetch(`${backendUrl}/api/trips/my-trips`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message ?? "Failed to fetch trips");
  }

  return data.data.trips;
}

export async function createMyTrips({
  title,
  description,
}: createMyRoomsInput) {
  const res = await fetch(`${backendUrl}/api/trips/create-trip`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message ?? "Failed to create a trip");
  }

  return data.data.createdTrip;
}
