import { Profile } from "../types/profile.type";

const createProfile = async (
  accessToken: string,
  displayName: string,
): Promise<Profile> => {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
  }

  const res = await fetch(`${backendUrl}/api/user/profile/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ displayName }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? "Failed to create profile");
  }

  return data;
};

export default createProfile;
