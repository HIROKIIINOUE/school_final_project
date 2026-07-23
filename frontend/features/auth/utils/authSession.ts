// create and store session data

import { supabase } from "@/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

export type OAuthContinueResult =
  | { ok: true; session: Session; user: User }
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
  const code = params.get("code");
  const oauthError = params.get("error");
  const oauthErrorCode = params.get("error_code");

  console.log("[OAuth Session] callback parameters parsed", {
    hasAccessToken: Boolean(accessToken),
    hasRefreshToken: Boolean(refreshToken),
    hasCode: Boolean(code),
    hasOAuthError: Boolean(oauthError || oauthErrorCode),
    oauthError: oauthError ?? null,
    oauthErrorCode: oauthErrorCode ?? null,
  });

  if (accessToken && refreshToken) {
    // save session data both in supabase and in AsyncStorage
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    console.log("[OAuth Session] setSession completed", {
      hasSession: Boolean(data.session),
      hasUser: Boolean(data.session?.user),
      userId: data.session?.user.id ?? null,
      errorMessage: error?.message ?? null,
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
    return { ok: true, session: data.session, user: data.session.user };
  }

  // fallback, try to create session with supabase.auth.exchangeCodeForSession()
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("[OAuth Session] code exchange completed", {
      hasSession: Boolean(data.session),
      hasUser: Boolean(data.session?.user),
      userId: data.session?.user.id ?? null,
      errorMessage: error?.message ?? null,
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
    return { ok: true, session: data.session, user: data.session.user };
  }

  return {
    ok: false,
    reason: "missing_session",
    message: "OAuth callback did not include session tokens",
  };
};
