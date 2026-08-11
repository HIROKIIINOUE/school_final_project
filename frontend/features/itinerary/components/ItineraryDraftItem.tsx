import { View, Text, Pressable } from "react-native";
import React from "react";
import { ItineraryDraftItem } from "../types/types";
import { formatTime } from "@/lib/formatDate";
import { MapPin, SquarePen, Trash2 } from "lucide-react-native";

type Props = {
  itineraryItem: ItineraryDraftItem;
  onEditPress: (id: string) => void;
  onDeletePress: (id: string) => void;
};

const ItineraryDraftCardItem = ({
  itineraryItem,
  onEditPress,
  onDeletePress,
}: Props) => {
  const time = formatTime(new Date(itineraryItem.startTime));
  const identity = itineraryItem.id ?? itineraryItem.clientId;
  return (
    <View className="relative mb-md flex flex-row">
      <View className="absolute -left-7.75 top-sm h-3 w-3 rounded-app-full bg-primary"></View>
      <View className="rounded-app-md border border-outline-variant bg-card px-md py-sm shadow-sm flex-1">
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
      <View className="flex gap-2 items-center justify-center ml-sm">
        <Pressable
          onPress={() => {
            onEditPress(identity);
          }}
        >
          <SquarePen color={"#4db6b6"} />
        </Pressable>
        <Pressable onPress={() => onDeletePress(identity)}>
          <Trash2 color={"#ba1a1a"} />
        </Pressable>
      </View>
    </View>
  );
};

export default ItineraryDraftCardItem;
