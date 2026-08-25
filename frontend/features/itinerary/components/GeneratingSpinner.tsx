import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

const GeneratingSpinner = () => {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-white/80">
      <BlurView
        intensity={50}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      <View className="items-center gap-md bg-transparent px-xl py-lg ">
        <ActivityIndicator size="large" />

        <Text className="text-center font-semibold text-primary">
          Generating your itinerary from bookings...
        </Text>
      </View>
    </View>
  );
};

export default GeneratingSpinner;
