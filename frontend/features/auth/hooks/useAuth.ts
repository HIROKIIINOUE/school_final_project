import { useState } from "react";
import { useRouter } from "expo-router";
import { OAuthProviderId } from "../types/provider.type";
import { handleSignInWithOAuth } from "../api/signInWithOAuth";
import { buildRedirect } from "@/lib/appConfig";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import checkProfile from "../api/checkProfile";

export const useAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);

  const handleOAuthContinue = async (provider: OAuthProviderId) => {
    setIsSubmitting(true);

    try {
      const path = "/auth/callback";
      const redirectTo = buildRedirect(path);
      const result = await handleSignInWithOAuth(provider, redirectTo);
      if (!result.ok) {
        if (result.reason !== "cancelled") {
          return;
        }
        toast.error("You failed to sign in. Please try again.");
        return;
      }

      setUser(result.user);
      const profileResult = await checkProfile(result.session.access_token);

      if (profileResult.hasProfile) {
        setProfile(profileResult.profile);
        // TODO: overview route is not created yet.
        // router.replace("/(protected)/overview");
      } else {
        setProfile(null);
        router.replace("/profile");
      }

      toast.success("You signed in successfully");
      return { user: result.user, profileResult };
    } catch (error) {
      console.error(error);
      toast.error("Something wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleOAuthContinue };
};
