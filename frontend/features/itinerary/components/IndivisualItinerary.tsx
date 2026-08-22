import { View, Text } from "react-native";
import React from "react";
import { SavedItineraryItem } from "../types/types";
import ItineraryCardItem from "./ItineraryCardItem";
import { formatDayLabel, formatDayNumber } from "@/lib/formatDate";
import { Star } from "lucide-react-native";

type Props = {
  deletingItemId: string | null;
  itineraries: SavedItineraryItem[];
  onDelete: (item: SavedItineraryItem) => void;
  onEdit: (item: SavedItineraryItem) => void;
};

const IndivisualItinerary = ({
  deletingItemId,
  itineraries,
  onDelete,
  onEdit,
}: Props) => {
  const firstDate = new Date(itineraries[0].startTime);

  const dayNumber = formatDayNumber(firstDate);
  const dayLabel = formatDayLabel(firstDate);

  firstDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = firstDate.getTime() === today.getTime();
  return (
    <View className="relative mb-xl bg-background px-container flex-1">
      <View className="absolute bottom-0 left-9.5 top-12 w-px bg-outline-variant" />
      <View className="mb-md flex-row items-center justify-start pl-11 gap-sm">
        <Text
          className={`${isToday ? "font-sans text-[14px] leading-container mt-md text-primary font-bold" : "list-item-title flex-1 mt-md"}`}
        >
          {dayNumber} - {dayLabel}
        </Text>
        {isToday && (
          <View className="badge-secondary mt-md">
            <View className="flex flex-row items-center gap-sm">
              {/* <Star size={15} /> */}
              <Text className="badge-primary-text">Today</Text>
            </View>
          </View>
        )}
      </View>
      <View className="gap-md pl-11">
        {itineraries.map((item) => (
          <ItineraryCardItem
            key={item.id}
            itineraryItem={item}
            isDeleting={deletingItemId === item.id}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </View>
    </View>
  );
};

export default IndivisualItinerary;
