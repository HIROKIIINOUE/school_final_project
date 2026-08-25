import { grabAccessToken } from "@/lib/getAccessToken";
import { SavedItineraryItem, SaveItineraryItemInput } from "../types/types";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

type ApiResponse<T> = { data: T };

export class ItineraryApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor({
    status,
    code,
    message,
  }: {
    status: number;
    code?: string;
    message: string;
  }) {
    super(message);
    this.name = "ItineraryApiError";
    this.status = status;
    this.code = code;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ItineraryApiError({
      status: response.status,
      code: body?.error?.code,
      message:
        body?.error?.message ??
        body?.message ??
        `Itinerary request failed with status ${response.status}`,
    });
  }

  return (body as ApiResponse<T>).data;
}

async function authorizationHeaders() {
  const accessToken = await grabAccessToken();
  return { Authorization: `Bearer ${accessToken}` };
}

function itineraryUrl(tripId: string, itemId?: string) {
  const baseUrl = `${BACKEND_URL}/api/trips/${encodeURIComponent(tripId)}/itinerary`;
  return itemId ? `${baseUrl}/${encodeURIComponent(itemId)}` : baseUrl;
}

export async function fetchItineraries(
  tripId: string,
): Promise<SavedItineraryItem[]> {
  const authorization = await authorizationHeaders();
  const response = await fetch(itineraryUrl(tripId), {
    headers: authorization,
  });

  return parseResponse<SavedItineraryItem[]>(response);
}

export async function createItineraryItem({
  tripId,
  input,
}: {
  tripId: string;
  input: SaveItineraryItemInput;
}): Promise<SavedItineraryItem> {
  const authorization = await authorizationHeaders();
  const response = await fetch(itineraryUrl(tripId), {
    method: "POST",
    headers: { ...authorization, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseResponse<SavedItineraryItem>(response);
}

export async function updateItineraryItem({
  tripId,
  item,
  input,
}: {
  tripId: string;
  item: SavedItineraryItem;
  input: SaveItineraryItemInput;
}): Promise<SavedItineraryItem> {
  const authorization = await authorizationHeaders();
  const response = await fetch(itineraryUrl(tripId, item.id), {
    method: "PATCH",
    headers: {
      ...authorization,
      "Content-Type": "application/json",
      "If-Match": `"${item.updatedAt}"`,
    },
    body: JSON.stringify(input),
  });

  return parseResponse<SavedItineraryItem>(response);
}

export async function deleteItineraryItem({
  tripId,
  item,
}: {
  tripId: string;
  item: SavedItineraryItem;
}): Promise<void> {
  const authorization = await authorizationHeaders();
  const response = await fetch(itineraryUrl(tripId, item.id), {
    method: "DELETE",
    headers: { ...authorization, "If-Match": `"${item.updatedAt}"` },
  });

  if (!response.ok) {
    await parseResponse<never>(response);
  }
}

export async function generateItinerariesFromBookings({
  tripId,
}: {
  tripId: string;
}): Promise<SavedItineraryItem[]> {
  const authorization = await authorizationHeaders();
  const res = await fetch(`${itineraryUrl(tripId)}/generate-from-bookings`, {
    method: "POST",
    headers: { ...authorization },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ItineraryApiError({
      status: res.status,
      code: data.error?.code,
      message:
        data?.error?.message ??
        data?.message ??
        `Itinerary request failed with status ${res.status}`,
    });
  }

  return data.data;
}
