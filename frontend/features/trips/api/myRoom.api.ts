import { supabase } from "@/lib/supabaseClient";
import { createMyRoomsInput } from "../types/types";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

export async function fetchMyRooms() {
  console.log("[Trips API] reading Supabase session");
  const { data: sessionData, error } = await supabase.auth.getSession();

  console.log("[Trips API] session result", {
    hasSession: Boolean(sessionData.session),
    hasAccessToken: Boolean(sessionData.session?.access_token),
    userId: sessionData.session?.user.id ?? null,
    errorMessage: error?.message ?? null,
  });

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

  console.log("[Trips API] response received", {
    status: res.status,
    ok: res.ok,
    tripCount: Array.isArray(data?.data?.trips)
      ? data.data.trips.length
      : null,
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
