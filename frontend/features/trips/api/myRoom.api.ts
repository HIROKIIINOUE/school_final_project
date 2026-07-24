import { grabAccessToken } from "@/lib/getAccessToken";
import { createMyRoomsInput } from "../types/types";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

export async function fetchMyRooms() {
  console.log("[Trips API] reading Supabase session");

  const accessToken = await grabAccessToken();

  const res = await fetch(`${backendUrl}/api/trips/my-trips`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  console.log("[Trips API] response received", {
    status: res.status,
    ok: res.ok,
    tripCount: Array.isArray(data?.data?.trips) ? data.data.trips.length : null,
    errorMessage: data?.error?.message ?? data?.message ?? null,
  });

  if (!res.ok) {
    throw new Error(data.error?.message ?? "Failed to fetch trips");
  }

  console.log(data);

  return data.data.trips;
}

export async function createMyTrips({
  title,
  description,
}: createMyRoomsInput) {
  const accessToken = await grabAccessToken();

  const res = await fetch(`${backendUrl}/api/trips/create-trip`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to create trip");
    throw new Error(
      data.error?.message ?? data.message ?? "Failed to create a trip",
    );
  }

  return data.data.createdTrip;
}
