import { View, Text } from "react-native";
import React from "react";
import { ItineraryInput } from "../types/types";
import ItineraryCardItem from "./ItineraryCardItem";
import { formateDate } from "@/lib/formatDate";

type Props = { date: string; itineraries: ItineraryInput[] };

const IndivisualItinerary = ({ date, itineraries }: Props) => {
  const dateNum = formateDate(new Date(date)).split(",")[0];

  return (
    <View className="mb-xl relative">
      <View className="sticky top-20 bg-background/90 backdrop-blur-sm py-2 z-10 flex items-center gap-3">
        <Text className="h-8 w-8 rounded-full bg-secondary-container text-primary flex items-center justify-center text-label-md font-label-md font-bold"></Text>
        <Text className="text-title-md font-title-md text-on-background">
          {dateNum} - {itineraries[0].title}
        </Text>
      </View>
      {itineraries.map((item) => (
        <ItineraryCardItem itineraryItem={item} />
      ))}
    </View>
  );
};

export default IndivisualItinerary;
