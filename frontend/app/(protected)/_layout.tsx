import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
