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
      console.log("[AuthInitializer] synchronizing session", {
        userId: user.id,
        hasAccessToken: Boolean(accessToken),
      });
      setUser(user);
      setProfile(null);
      setProfileStatus("loading");

      try {
        const result = await checkProfile(accessToken);
        if (!isActive) {
          return;
        }
        if (result.hasProfile) {
          console.log("[AuthInitializer] profile found", {
            userId: user.id,
          });
          setProfile(result.profile);
          setProfileStatus("exists");
        } else {
          console.log("[AuthInitializer] profile missing", {
            userId: user.id,
          });
          setProfile(null);
          setProfileStatus("missing");
        }

        setAuthStatus("authenticated");
        console.log("[AuthInitializer] authentication synchronized", {
          userId: user.id,
          profileStatus: result.hasProfile ? "exists" : "missing",
        });
      } catch (e) {
        console.error("[AuthInitializer] failed to check profile", {
          userId: user.id,
          message: e instanceof Error ? e.message : "Unknown error",
        });
        if (!isActive) {
          return;
        }
        setProfile(null);
        setProfileStatus("error");
        setAuthStatus("authenticated");
      }
    }

    async function initializeAuth() {
      console.log("[AuthInitializer] initial session check started");
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
        console.log("[AuthInitializer] no initial session; clearing auth");
        clearAuth();
        return;
      }

      await synchronizeSession(session.access_token, session.user);
    }

    initializeAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AuthInitializer] auth event", {
        event,
        hasSession: Boolean(session),
        hasAccessToken: Boolean(session?.access_token),
        userId: session?.user.id ?? null,
      });

      if (!isActive) {
        console.log("[AuthInitializer] ignored auth event after cleanup", {
          event,
        });
        return;
      }
      if (!session) {
        console.log("[AuthInitializer] auth event has no session; clearing auth", {
          event,
        });
        clearAuth();
        return;
      }

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        console.log("[AuthInitializer] auth event will synchronize profile", {
          event,
          userId: session.user.id,
        });
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
