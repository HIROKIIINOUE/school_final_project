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

  const res = await fetch(`${backendUrl}/api/user/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to authenticate with the backend");
  }

  const data: CheckProfileResult = await res.json();

  return data;
};

export default checkProfile;
