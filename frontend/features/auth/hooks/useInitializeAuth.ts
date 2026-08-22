import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth.store";
import { User } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import checkProfile from "../api/checkProfile";

export const useInitializeAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setAuthStatus = useAuthStore((state) => state.setAuthStatus);
  const setProfileStatus = useAuthStore((state) => state.setProfileStatus);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const authGeneration = useRef(0);

  useEffect(() => {
    let isActive = true;

    const synchronizeSession = async (
      accessToken: string,
      user: User,
      generation: number,
    ) => {
      if (!isActive || generation !== authGeneration.current) {
        return;
      }

      setUser(user);
      setProfile(null);
      setProfileStatus("loading");
      try {
        const result = await checkProfile(accessToken);
        if (!isActive || generation !== authGeneration.current) {
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
      } catch (error) {
        if (!isActive || generation !== authGeneration.current) {
          return;
        }
        console.error("[AuthInitializer] failed to check profile", {
          userId: user.id,
          message: error instanceof Error ? error.message : "Unknown error",
        });
        setProfile(null);
        setProfileStatus("error");
        setAuthStatus("authenticated");
      }
    };

    const initializeAuth = async () => {
      const generation = ++authGeneration.current;
      setAuthStatus("initializing");
      setProfileStatus("unchecked");
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isActive || generation !== authGeneration.current) {
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

      await synchronizeSession(session.access_token, session.user, generation);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isActive) {
        return;
      }
      if (!session) {
        authGeneration.current += 1;
        clearAuth();
        return;
      }

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        const generation = ++authGeneration.current;
        void synchronizeSession(session.access_token, session.user, generation);
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [clearAuth, setAuthStatus, setProfile, setProfileStatus, setUser]);
};
