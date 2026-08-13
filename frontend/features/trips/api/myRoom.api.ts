import { grabAccessToken } from "@/lib/getAccessToken";
import {
  CreateMyRoomsInput,
  MyRoomType,
  UpdateMyRoomInput,
} from "../types/types";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

export async function fetchMyRooms(): Promise<MyRoomType[]> {
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
}: CreateMyRoomsInput) {
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

export async function updateMyTrips(input: UpdateMyRoomInput) {
  const accessToken = await grabAccessToken();
  console.log("Trip Id for update: ", input.tripId);

  const res = await fetch(
    `${backendUrl}/api/trips/update-trip/${input.tripId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: input.title,
        description: input.description,
      }),
    },
  );

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    console.error("Failed to update trip");
    throw new Error(
      data.error?.message ?? data.message ?? "Failed to update a trip",
    );
  }

  return data.data.updatedTrip;
}

export async function deleteTrip({ tripId }: { tripId: string }) {
  const accessToken = await grabAccessToken();
  console.log("delete trip Id: ", tripId);
  const res = await fetch(`${backendUrl}/api/trips/delete-trip/${tripId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to delete the trip:", data.error);
    throw new Error(
      data.error?.message ?? data.message ?? "Failed to delete a trip",
    );
  }

  return data.data;
}
export async function joinTrip({ inviteCode }: { inviteCode: string }) {
  const accessToken = await grabAccessToken();

  const res = await fetch(`${backendUrl}/api/trips/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ inviteCode }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to join the trip:", data.error);
    throw new Error(
      data.error?.message ?? data.message ?? "Failed to create a trip",
    );
  }

  return data.data;
}
