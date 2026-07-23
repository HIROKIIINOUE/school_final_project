import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { Profile } from "@/features/profile/types/profile.type";

type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

type ProfileStatus = "unchecked" | "loading" | "exists" | "missing" | "error";

// user contains user_id, email, provider and so on
type AuthState = {
  user: User | null;
  profile: Profile | null;
  authStatus: AuthStatus;
  profileStatus: ProfileStatus;

  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setProfileStatus: (status: ProfileStatus) => void;

  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  authStatus: "initializing",
  profileStatus: "unchecked",

  setUser: (user: User | null) => set({ user }),
  setProfile: (profile: Profile | null) => set({ profile }),
  setAuthStatus: (status) => set({ authStatus: status }),
  setProfileStatus: (status) => set({ profileStatus: status }),

  clearAuth: () =>
    set({
      user: null,
      profile: null,
      authStatus: "unauthenticated",
      profileStatus: "unchecked",
    }),
}));
