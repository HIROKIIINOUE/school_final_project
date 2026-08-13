import { useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripHeader() {
  const router = useRouter();

  return (
    <View className="bg-surface">
      <SafeAreaView edges={["top", "left", "right"]}>
        <View className="h-14 flex-row items-center px-md">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center"
          >
            <ChevronLeft size={26} />
          </Pressable>

          <Text className="text-lg font-semibold text-primary-container">
            My Trips
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
