import { ItineraryInput } from "../types/types";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

export async function fetchItineraries(tripId: string) {
  const res = await fetch(`${BACKEND_URL}/api/itinerary/${tripId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("res.ok failed. Failed to fetch itineraries");
    throw new Error(data.error?.message ?? "Failed to fetch overview data");
  }

  return data.data;
}

export async function createItineraries({
  tripId,
  itineraryInputs,
}: {
  tripId: string;
  itineraryInputs: ItineraryInput[];
}) {
  const res = await fetch(`${BACKEND_URL}/api/itineray/${tripId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itineraryInputs }),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to create itineraries");
    throw new Error(data.error?.message ?? "Failed to create itineraries");
  }

  return data.data;
}
