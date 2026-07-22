// Start the OAuth flow with Supabase Auth

import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabaseClient";
import {
  createSessionFromOAuthCallbackUrl,
  OAuthContinueResult,
} from "../utils/authSession";
import { OAuthProviderId } from "../types/provider.type";

export const handleSignInWithOAuth = async (
  provider: OAuthProviderId,
  redirectTo: string,
): Promise<OAuthContinueResult> => {
  try {
    // data stores url which is needed to open Google/Apple browser
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true, // bring users directly Google or Apple Auth page
      },
    });

    if (error) {
      return { ok: false, reason: "unknown", message: error.message };
    }
    if (!data.url) {
      return {
        ok: false,
        reason: "unknown",
        message: "OAuth authorization URL was not returned",
      };
    }

    // open Google/Apple auth browser and confirm it. result stores "Authentication result URL"
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo, {
      preferEphemeralSession: true, // not use existed login status or cookie from user's devise
    });

    if (result.type !== "success") {
      return {
        ok: false,
        reason: "cancelled",
        message: "OAuth sign-in was cancelled",
      };
    }

    // create and store session data (access token and refresh token)
    return await createSessionFromOAuthCallbackUrl(result.url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { ok: false, reason: "unknown", message };
  }
};
