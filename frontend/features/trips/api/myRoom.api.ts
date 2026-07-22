import { supabase } from "@/lib/supabaseClient";
import { createMyRoomsInput } from "../types/types";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

export async function fetchMyRooms() {
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Failed to gain session");
  }

  if (!sessionData.session?.access_token) {
    throw new Error("Access token not found");
  }

  const res = await fetch(`${backendUrl}/api/trips/my-trips`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionData.session.access_token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

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
  const res = await fetch(`${backendUrl}/api/trips/create-trip`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to create trip");
    throw new Error(data.error?.message ?? "Failed to create a trip");
  }

  return data.data.createdTrip;
}
