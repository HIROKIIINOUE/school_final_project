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
import { useEffect } from "react";
import { chatSocket } from "@/features/chat/socket/chatSocket";
import { connectChatSocket } from "@/features/chat/socket/connectChatSocket";

const queryClient = new QueryClient();

function RootNavigator() {
  useInitializeAuth();
  const authStatus = useAuthStore((state) => state.authStatus);
  const profileStatus = useAuthStore((state) => state.profileStatus);

  console.log("[Auth state]", { authStatus, profileStatus });

  useEffect(() => {
    // If user is not logged in anymore, that's when disconnect socket connection
    if (authStatus !== "authenticated") {
      chatSocket.disconnect();
      return;
    }

    const handleConnect = () => {
      console.log("Chat socket connected:", chatSocket.id);
    };

    const handleConnectError = (error: Error) => {
      console.error("Chat socket connection failed:", error.message);
    };

    chatSocket.on("connect", handleConnect);
    chatSocket.on("connect_error", handleConnectError);

    // if user is logged in, connect socket. one socker per app => that's why connecting here.
    connectChatSocket();

    return () => {
      chatSocket.disconnect();

      chatSocket.off("connect", handleConnect);
      chatSocket.off("connect_error", handleConnect);
    };
  }, [authStatus]);

  if (
    authStatus === "initializing" ||
    (authStatus === "authenticated" && profileStatus === "loading")
  ) {
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
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
