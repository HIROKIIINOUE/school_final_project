import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { Profile } from "@/features/profile/types/profile.type";

// user contains user_id, email, provider and so on
type AuthState = {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User) => void;
  setProfile: (profile: Profile | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => set({ user: null, profile: null }),
}));
