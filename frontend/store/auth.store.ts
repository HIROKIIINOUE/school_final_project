import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { Profile } from "@/features/profile/types/profile.type";

type LoadingStatus = "Authorized" | "Unauthorized" | "Idle";

// user contains user_id, email, provider and so on
type AuthState = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;

  setLoadingStatus: (status: boolean) => void;

  setUser: (user: User) => void;
  setProfile: (profile: Profile | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,

  setLoadingStatus: (status) => set({ isLoading: status }),

  setUser: (user: User) => set({ user }),
  setProfile: (profile: Profile | null) => set({ profile }),
  clearAuth: () => set({ user: null, profile: null }),
}));
