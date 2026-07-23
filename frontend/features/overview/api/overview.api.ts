const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

const API_ROUTE = `${BACKEND_URL}/api/trip/overview`;

export async function getOverviewData({ id }: { id: string }) {
  const res = await fetch(`${API_ROUTE}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("res.ok failed. Failed to fetch overview data");
    throw new Error(data.error?.message ?? "Failed to fetch overview data");
  }

  return data.data;
}
