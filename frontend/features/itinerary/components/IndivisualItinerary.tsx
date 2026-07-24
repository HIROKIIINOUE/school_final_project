import { View, Text } from "react-native";
import React from "react";
import { ItineraryInput } from "../types/types";
import ItineraryCardItem from "./ItineraryCardItem";
import { formatDayLabel, formatDayNumber } from "@/lib/formatDate";

type Props = { date: string; itineraries: ItineraryInput[] };

const IndivisualItinerary = ({ date, itineraries }: Props) => {
  console.log(date);
  const firstDate = new Date(itineraries[0].startTime);

  const dayNumber = formatDayNumber(firstDate);
  const dayLabel = formatDayLabel(firstDate);

  return (
    <View className="relative mb-xl bg-background px-container">
      <View className="absolute bottom-0 left-9.5 top-12 w-px bg-outline-variant" />
      <View className="mb-md flex-row items-center pl-11">
        <Text className="list-item-title flex-1">
          {dayNumber} - {dayLabel}
        </Text>
      </View>
      <View className="gap-md pl-11">
        {itineraries.map((item) => (
          <ItineraryCardItem key={item.title} itineraryItem={item} />
        ))}
      </View>
    </View>
  );
};

export default IndivisualItinerary;
