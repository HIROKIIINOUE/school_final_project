import checkProfile from "@/features/auth/api/checkProfile";
import { useAuthStore } from "@/store/auth.store";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setAuthStatus = useAuthStore((state) => state.setAuthStatus);
  const setProfileStatus = useAuthStore((state) => state.setProfileStatus);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    let isActive = true;
    async function synchronizeSession(accessToken: string, user: User) {
      setUser(user);
      setProfile(null);
      setProfileStatus("loading");

      try {
        const result = await checkProfile(accessToken);
        if (!isActive) {
          return;
        }
        if (result.hasProfile) {
          setProfile(result.profile);
          setProfileStatus("exists");
        } else {
          setProfile(null);
          setProfileStatus("missing");
        }

        setAuthStatus("authenticated");
      } catch (e) {
        console.error("Failed to check profile");
        if (!isActive) {
          return;
        }
        setProfile(null);
        setProfileStatus("error");
        setAuthStatus("authenticated");
      }
    }

    async function initializeAuth() {
      setAuthStatus("initializing");
      setProfileStatus("unchecked");

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log("[AuthInitializer] getSession result:", {
        hasSession: Boolean(session),
        userId: session?.user.id ?? null,
        hasAccessToken: Boolean(session?.access_token),
        error,
      });

      if (!isActive) {
        return;
      }

      if (error) {
        console.error("Failed to restore Supabase session:", error);
        clearAuth();
        return;
      }

      if (!session) {
        clearAuth();
        return;
      }

      await synchronizeSession(session.access_token, session.user);
    }

    initializeAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isActive) {
        return;
      }
      if (!session) {
        clearAuth();
        return;
      }

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        void synchronizeSession(session.access_token, session.user);
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [clearAuth, setAuthStatus, setProfile, setProfileStatus, setUser]);

  return null;
}
