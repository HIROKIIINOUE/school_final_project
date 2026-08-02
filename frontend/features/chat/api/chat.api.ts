import { grabAccessToken } from "@/lib/getAccessToken";
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

export async function fetchMessages({ id }: { id: string }) {
  const accessToken = await grabAccessToken();

  const res = await fetch(`${BACKEND_URL}/api/trip/${id}/chat`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(
      "res.ok failed. Failed to fetch itineraries",
      data.error?.message ?? data.message,
    );
    throw new Error(data.error?.message ?? "Failed to fetch overview data");
  }

  return data.data;
}

export async function postMessage({
  id,
  body,
}: {
  id: string;
  body: { clientMessageId: string; content: string };
}) {
  const accessToken = await grabAccessToken();

  const res = await fetch(`${BACKEND_URL}/api/trip/${id}/chat/post-chat`, {
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
      "res.ok failed. Failed to fetch itineraries",
      data.error?.message ?? data.message,
    );
    throw new Error(data.error?.message ?? "Failed to fetch overview data");
  }

  return data.data;
}
