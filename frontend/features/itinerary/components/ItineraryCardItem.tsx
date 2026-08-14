import { View, Text, Pressable } from "react-native";
import React from "react";
import { SavedItineraryItem } from "../types/types";
import { formatTime } from "@/lib/formatDate";
import { MapPin, Pencil, Trash2 } from "lucide-react-native";

type Props = {
  itineraryItem: SavedItineraryItem;
  isDeleting: boolean;
  onDelete: (item: SavedItineraryItem) => void;
  onEdit: (item: SavedItineraryItem) => void;
};

const ItineraryCardItem = ({
  itineraryItem,
  isDeleting,
  onDelete,
  onEdit,
}: Props) => {
  const time = formatTime(new Date(itineraryItem.startTime));
  return (
    <View className="relative mb-md flex flex-row">
      <View className="absolute -left-7.75 top-sm h-3 w-3 rounded-app-full bg-primary"></View>
      <View className="rounded-app-md border border-outline-variant bg-card px-md py-sm shadow-sm flex-1">
        <View className="stack-xs">
          <View className="flex-row items-center justify-between gap-sm">
            <View className="badge-secondary self-start">
              <Text className="badge-secondary-text">{time}</Text>
            </View>
            <View className="flex-row items-center gap-xs">
              <Pressable
                accessibilityLabel={`Edit ${itineraryItem.title}`}
                accessibilityRole="button"
                className="h-11 w-11 items-center justify-center rounded-app-full bg-secondary-container"
                disabled={isDeleting}
                onPress={() => onEdit(itineraryItem)}
              >
                <Pencil size={18} className="text-primary" />
              </Pressable>
              <Pressable
                accessibilityLabel={`Delete ${itineraryItem.title}`}
                accessibilityRole="button"
                className="h-11 w-11 items-center justify-center rounded-app-full bg-error-container"
                disabled={isDeleting}
                onPress={() => onDelete(itineraryItem)}
              >
                <Trash2 size={18} className="text-error" />
              </Pressable>
            </View>
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
