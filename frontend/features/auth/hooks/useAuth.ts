import { useState } from "react";
import { OAuthProviderId } from "../types/provider.type";
import { handleSignInWithOAuth } from "../api/signInWithOAuth";
import { buildRedirect } from "@/lib/appConfig";
import { toast } from "sonner";

export const useAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      // 認証済み user/session を Zustand に反映し、必要に応じて profile の初期化を行う
      toast.success("You signed in successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleOAuthContinue };
};
