import { View, Text } from "react-native";
import React from "react";
import { ItineraryInput } from "../types/types";
import { formatTime } from "@/lib/formatDate";
import { MapPin } from "lucide-react-native";

type Props = { itineraryItem: ItineraryInput };

const ItineraryCardItem = ({ itineraryItem }: Props) => {
  const time = formatTime(new Date(itineraryItem.startTime));
  return (
    <View className="relative mb-md">
      <View className="absolute -left-7.75 top-sm h-3 w-3 rounded-app-full bg-primary"></View>
      <View className="rounded-app-md border border-outline-variant bg-card px-md py-sm shadow-sm">
        <View className="stack-xs">
          <View className="badge-secondary self-start">
            <Text className="badge-secondary-text">{time}</Text>
          </View>
          <Text
            className="list-item-title"
            data-icon="hotel"
            data-weight="regular"
          >
            {itineraryItem.title}
          </Text>
        </View>
        <Text className="mt-xs text-caption">
          {itineraryItem.detail ?? "No details provided"}
        </Text>
        <View className="mt-xs row-start gap-xs">
          <MapPin className="h-4 w-4 text-on-surface-variant" />
          <Text className="text-caption">
            {itineraryItem.location ?? "No location provided"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ItineraryCardItem;
