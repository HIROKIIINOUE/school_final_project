import { View, Text, Pressable } from "react-native";
import React from "react";
import { PlaneTakeoff, Timer } from "lucide-react-native";
import { ItineraryType } from "../types/types";
import { formatDayLabel, formatTime } from "@/lib/formatDate";

type Props = { itinerary: ItineraryType };

const ItineraryCardItem = ({ itinerary }: Props) => {
  return (
    <View className="w-full">
      <View className="bg-white border border-outline-variant rounded-[24px] p-md shadow-lg">
        <View className="flex items-center gap-md flex-row">
          <View className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary">
            {/* TODO: dynamically generate icons */}
            <PlaneTakeoff className="material-symbols-outlined text-[28px]" />
          </View>
          <View className="flex-1">
            <Text className="text-title-md font-title-md text-on-surface">
              {itinerary.title}
            </Text>
            <View className="flex flex-row gap-2 items-center my-sm">
              <Text className="text-body-md font-body-md text-muted">
                {formatDayLabel(itinerary.startTime)}
              </Text>
              <Text className="text-body-md font-body-md text-muted">
                {formatTime(itinerary.startTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItineraryCardItem;
