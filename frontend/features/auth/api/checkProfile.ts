import { Profile } from "@/features/profile/types/profile.type";

export type { Profile };

export type CheckProfileResult =
  | { hasProfile: true; profile: Profile }
  | { hasProfile: false; profile: null };

// check if user already has their profile or not
const checkProfile = async (
  accessToken: string,
): Promise<CheckProfileResult> => {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
  }

  console.log("[Profile API] checking profile", {
    hasAccessToken: Boolean(accessToken),
  });

  const res = await fetch(`${backendUrl}/api/user/profile`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json().catch(() => null);

  console.log("[Profile API] response received", {
    status: res.status,
    ok: res.ok,
    hasJsonBody: data !== null,
    hasProfile: data?.hasProfile ?? null,
    errorMessage: data?.error?.message ?? data?.message ?? null,
  });

  if (!res.ok) {
    const message =
      data?.error?.message ??
      data?.message ??
      `Profile request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
};

export default checkProfile;
