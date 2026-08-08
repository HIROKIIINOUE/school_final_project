import { grabAccessToken } from "@/lib/getAccessToken";
import { SavedMessage } from "../types/types";
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

type ApiResponse<T> = { data: T };

type PostMessageBody = { clientMessageId: string; content: string };

export async function fetchMessages({
  tripId,
}: {
  tripId: string;
}): Promise<SavedMessage[]> {
  const accessToken = await grabAccessToken();

  const res = await fetch(`${BACKEND_URL}/api/trips/${tripId}/messages`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  const data: ApiResponse<SavedMessage[]> = await res.json();

  if (!res.ok) {
    console.error("res.ok failed. Failed to fetch chat messages", data);
    throw new Error("Failed to fetch chat messages");
  }

  return data.data;
}

export async function postMessage({
  tripId,
  body,
}: {
  tripId: string;
  body: { clientMessageId: string; content: string };
}) {
  const accessToken = await grabAccessToken();

  const res = await fetch(`${BACKEND_URL}/api/trips/${tripId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(
      "res.ok failed. Failed to send messages",
      data.error?.message ?? data.message,
    );
    throw new Error(data.error?.message ?? "Failed to send messages");
  }

  return data.data;
}
