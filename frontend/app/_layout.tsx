import { Redirect, Stack } from "expo-router";
import "../globals.css";
import { useAuthStore } from "@/store/auth.store";
import Spinner from "@/components/Spinner";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RootLayout() {
  // is not logged in => redirect to login
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return null;
  }

  const isAuthenticated = user !== null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
    </Stack>
  );
}
