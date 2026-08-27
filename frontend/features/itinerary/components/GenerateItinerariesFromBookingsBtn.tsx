import { View, Text, Pressable } from "react-native";
import React from "react";
import { generateItinerariesFromBookings } from "../api/itinerary.api";
import Toast from "react-native-toast-message";
import MiniSpinner from "@/components/MiniSpinner";
import { Sparkles } from "lucide-react-native";

type Props = {
  tripId: string;
  setItineraries: () => Promise<void>;
  isGenerating: boolean;
  setIsGenerating: (signal: boolean) => void;
};

const GenerateItinerariesFromBookingsBtn = ({
  tripId,
  setItineraries,
  isGenerating,
  setIsGenerating,
}: Props) => {
  async function handleOnGenerate() {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const itineraries = await generateItinerariesFromBookings({ tripId });

      if (itineraries.length === 0) {
        Toast.show({
          type: "info",
          text1: "No new itinerary items to generate",
        });
        return;
      }
      await setItineraries();
      Toast.show({ type: "success", text1: "Generated Successfully" });
    } catch (e) {
      console.error("Failed to generate itineraries:", e);
      Toast.show({ type: "error", text1: "Failed to generate itineraries" });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Pressable
      className="btn-primary m-md px-md"
      disabled={isGenerating}
      onPress={handleOnGenerate}
    >
      <View className="flex flex-row items-center gap-sm px-md">
        <Sparkles />
        <Text className="btn-primary-text">Generate Itineraries</Text>
      </View>
    </Pressable>
  );
};

export default GenerateItinerariesFromBookingsBtn;
