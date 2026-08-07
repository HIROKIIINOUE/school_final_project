import { Stack } from "expo-router";
import "../globals.css";
import Spinner from "@/components/Spinner";
import { useAuthStore } from "@/store/auth.store";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/config/toastConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useInitializeAuth } from "@/features/auth/hooks/useInitializeAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function RootNavigator() {
  useInitializeAuth();
  const authStatus = useAuthStore((state) => state.authStatus);
  const profileStatus = useAuthStore((state) => state.profileStatus);

  if (authStatus === "initializing" || profileStatus === "loading") {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Spinner message="Loading user..." />
      </SafeAreaView>
    );
  }

  const isAuthenticated = authStatus === "authenticated";

  const needsProfile = isAuthenticated && profileStatus === "missing";

  const hasProfile = isAuthenticated && profileStatus === "exists";

  const profileLoadFailed = isAuthenticated && profileStatus === "error";

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
