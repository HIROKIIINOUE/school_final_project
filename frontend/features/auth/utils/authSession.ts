// create and store session data

import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

type OAuthContinueResult =
  | { ok: true; user: User }
  | {
      ok: false;
      reason: "cancelled" | "missing_session" | "unknown";
      message: string;
    };

const parseOAuthCallbackParams = (url: string) => {
  const hashIndex = url.indexOf("#");
  const questionIndex = url.indexOf("?");
  const params = new URLSearchParams();

  if (hashIndex !== -1) {
    const fragment = url.slice(hashIndex + 1);
    new URLSearchParams(fragment).forEach((value, key) =>
      params.set(key, value),
    );
  }

  if (questionIndex !== -1) {
    const queryEnd = hashIndex === -1 ? undefined : hashIndex - 1;
    const query = url.slice(questionIndex + 1, queryEnd);
    new URLSearchParams(query).forEach((value, key) => params.set(key, value));
  }

  return params;
};

// create and save session data (access token and refresh toke) from provided url, and return only user data
export const createSessionFromOAuthCallbackUrl = async (
  url: string,
): Promise<OAuthContinueResult> => {
  const params = parseOAuthCallbackParams(url);

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (accessToken && refreshToken) {
    // save session data both in supabase and in AsyncStorage
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) {
      return { ok: false, reason: "unknown", message: error.message };
    }
    if (!data.session?.user) {
      return {
        ok: false,
        reason: "missing_session",
        message: "OAuth session was not created",
      };
    }
    return { ok: true, user: data.session.user };
  }

  // fallback, try to create session with supabase.auth.exchangeCodeForSession()
  const code = params.get("code");
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return { ok: false, reason: "unknown", message: error.message };
    }
    if (!data.session?.user) {
      return {
        ok: false,
        reason: "missing_session",
        message: "OAuth session was not created",
      };
    }
    return { ok: true, user: data.session.user };
  }

  return {
    ok: false,
    reason: "missing_session",
    message: "OAuth callback did not include session tokens",
  };
};
