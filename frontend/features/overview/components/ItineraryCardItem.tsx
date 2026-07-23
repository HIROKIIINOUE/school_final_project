import { View, Text, Pressable } from "react-native";
import React from "react";
import { PlaneTakeoff, Timer } from "lucide-react-native";
import { ItineraryType } from "../types/types";
import { formateDate } from "@/lib/formatDate";

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
            <Text className="text-body-md font-body-md text-muted mt-xs">
              {formateDate(itinerary.startTime)}
            </Text>
            <Text className="text-body-md font-body-md text-muted">{}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItineraryCardItem;
