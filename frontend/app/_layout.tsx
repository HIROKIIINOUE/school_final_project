import { Stack } from "expo-router";
import "../globals.css";
import Spinner from "@/components/Spinner";
import { useAuthStore } from "@/store/auth.store";
import { useInitializeAuth } from "@/features/auth/hooks/useInitializeAuth";

export default function RootNavigator() {
  useInitializeAuth()
  const authStatus = useAuthStore((state) => state.authStatus);
  const profileStatus = useAuthStore((state) => state.profileStatus);

  if (authStatus === "initializing" || profileStatus === "loading") {
    return <Spinner message="Loading user..." />;
  }

  const isAuthenticated = authStatus === "authenticated";

  const needsProfile = isAuthenticated && profileStatus === "missing";

  const hasProfile = isAuthenticated && profileStatus === "exists";

  const profileLoadFailed = isAuthenticated && profileStatus === "error";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={authStatus === "unauthenticated"}>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      <Stack.Protected guard={needsProfile}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>

      <Stack.Protected guard={hasProfile}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>

      <Stack.Protected guard={profileLoadFailed}>
        <Stack.Screen name="profile-error" />
      </Stack.Protected>
    </Stack>
  );
}

