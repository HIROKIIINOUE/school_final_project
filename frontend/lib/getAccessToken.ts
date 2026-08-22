import { supabase } from "./supabaseClient";

export async function grabAccessToken() {
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Failed to gain session");
  }

  if (!sessionData.session?.access_token) {
    throw new Error("Access token not found");
  }

  return sessionData.session.access_token;
}
