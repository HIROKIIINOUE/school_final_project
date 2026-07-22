import { Stack } from "expo-router";
import "../globals.css";
import Spinner from "@/components/Spinner";
import { AuthInitializer } from "@/features/auth/components/AuthInitializer";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

function RootNavigator() {
  const authStatus = useAuthStore((state) => state.authStatus);
  const profileStatus = useAuthStore((state) => state.profileStatus);

  useEffect(() => {
    console.log("[RootNavigator] guard state changed", {
      authStatus,
      profileStatus,
    });
  }, [authStatus, profileStatus]);

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

export default function RootLayout() {
  return (
    <>
      <AuthInitializer />
      <RootNavigator />
    </>
  );
}
