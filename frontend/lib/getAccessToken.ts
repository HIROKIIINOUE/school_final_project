import { supabase } from "./supabaseClient";

export async function grabAccessToken() {
  const { data: sessionData, error } = await supabase.auth.getSession();

  console.log("Fetching access token:", {
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

  return sessionData.session.access_token;
}
