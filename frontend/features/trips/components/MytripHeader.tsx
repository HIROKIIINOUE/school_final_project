import { View, Text, Image, Pressable } from "react-native";
import { LogOut } from "lucide-react-native";
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth.store";

const MytripHeader = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const profile = useAuthStore((state) => state.profile);

  const initial = profile?.displayName.trim().charAt(0).toUpperCase() || "?";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      clearAuth();
    } catch (error) {
      console.error("Logout failed:", error);
      Toast.show({
        type: "error",
        text1: "Unable to log out. Please try again.",
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <View className="bg-surface dark:bg-surface-dim docked full-width top-0 border-b border-outline-variant dark:border-outline flat no shadows flex flex-row justify-between items-center w-full px-sm py-md sticky z-40">
      <View className="flex items-center flex-row gap-md">
        <View className="w-20 h-20 rounded-full overflow-hidden border border-outline-variant shrink-0">
          {profile?.image ? (
            <Image
              alt="User profile avatar"
              className="w-full h-full object-cover"
              source={{ uri: profile.image }}
            />
          ) : (
            <View className="h-full w-full items-center justify-center bg-surface-container-highest">
              <Text className="font-bold text-lg text-on-surface-variant">
                {initial}
              </Text>
            </View>
          )}
        </View>
        <Text className="headline-lg font-headline-lg font-bold text-primary dark:text-primary-fixed-dim">
          My Trips
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out"
        className="btn-primary gap-sm disabled:opacity-50"
        disabled={isLoggingOut}
        onPress={handleLogout}
      >
        <LogOut size={18} />
        <Text className="btn-primary-text">
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Text>
      </Pressable>
    </View>
  );
};

export default MytripHeader;
