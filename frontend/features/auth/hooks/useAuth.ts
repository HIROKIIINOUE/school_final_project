import { useState } from "react";
import { Href, useRouter } from "expo-router";
import { OAuthProviderId } from "../types/provider.type";
import { handleSignInWithOAuth } from "../api/signInWithOAuth";
import { buildRedirect } from "@/lib/appConfig";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import checkProfile from "../api/checkProfile";

export const useAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOAuthContinue = async (provider: OAuthProviderId) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectTo = buildRedirect("/auth/callback");

      const result = await handleSignInWithOAuth(provider, redirectTo);

      if (!result.ok) {
        if (result.reason === "cancelled") {
          return;
        }

        toast.error("You failed to sign in. Please try again.");
        return;
      }

      /*
       * Do not set Zustand user/profile here.
       *
       * Supabase now owns the session.
       * AuthInitializer observes the auth change,
       * loads the profile, and updates route guards.
       */

      toast.success("You signed in successfully");
    } catch (error) {
      console.error("OAuth sign-in failed:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleOAuthContinue };
};
