import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth.store";
import createProfile from "../api/createProfile";
import { Profile } from "../types/profile.type";

export const useCreateProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<Profile | null>(null);
  const setProfile = useAuthStore((state) => state.setProfile);

  const submitProfile = async (displayName: string): Promise<Profile> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    setIsSubmitting(true);
    try {
      const profile = await createProfile(session.access_token, displayName);
      setCreatedProfile(profile);
      setProfile(profile);
      return profile;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createdProfile, isSubmitting, submitProfile };
};
