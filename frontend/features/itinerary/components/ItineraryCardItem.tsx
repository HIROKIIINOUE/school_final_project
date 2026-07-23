import { View, Text } from "react-native";
import React from "react";
import { ItineraryInput } from "../types/types";
import { formateDate } from "@/lib/formatDate";

type Props = { itineraryItem: ItineraryInput };

const ItineraryCardItem = ({ itineraryItem }: Props) => {
  const time = formateDate(new Date(itineraryItem.startTime))
    .split(",")[2]
    .trim();
  return (
    <View className="relative mb-lg group">
      <View className="absolute -left-7.75 top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></View>
      <View className="bg-white rounded-lg border border-outline-variant p-md shadow-sm transition-shadow hover:shadow-md">
        <View className="flex justify-between items-start mb-2">
          <Text className="text-label-md font-label-md text-primary font-bold bg-secondary-container px-2 py-1 rounded-full inline-block">
            {time}
          </Text>
          <Text
            className="material-symbols-outlined text-on-surface-variant text-sm"
            data-icon="hotel"
            data-weight="regular"
          >
            {itineraryItem.title}
          </Text>
        </View>
        <Text className="text-body-lg font-body-lg font-semibold text-on-background mb-1">
          {itineraryItem.detail ?? "No details provided"}
        </Text>
        <View className="text-body-md font-body-md text-on-surface-variant flex items-center gap-1">
          <Text
            className="material-symbols-outlined text-xs"
            data-icon="location_on"
            data-weight="regular"
          >
            location_on
          </Text>{" "}
          <Text>{itineraryItem.location ?? "No location provided"}</Text>
        </View>
      </View>
    </View>
  );
};

export default ItineraryCardItem;
