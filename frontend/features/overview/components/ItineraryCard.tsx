import { ScrollView, View, FlatList, Text, Pressable } from "react-native";
import React from "react";
import { ItineraryType } from "../types/types";
import ItineraryCardItem from "./ItineraryCardItem";
import { Timer } from "lucide-react-native";
import { Link } from "expo-router";

type Props = { itineraries: ItineraryType[]; tripId: string };

const ItineraryCard = ({ itineraries, tripId }: Props) => {
  const now = new Date();

  const activeItineraries = itineraries.filter((itinerary) => {
    const itineraryDate = new Date(itinerary.startTime);

    return itineraryDate >= now;
  });

  return (
    <View className="card mx-sm my-md">
      <Text className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mb-sm flex items-center gap-xs">
        <Timer className="material-symbols-outlined text-[16px]" />
        Up next
      </Text>
      {activeItineraries.length === 0 ? (
        <Text className="empty-text empty-inline">
          No upcoming itinerary items yet.
        </Text>
      ) : (
        <View className="flex gap-2">
          {activeItineraries.slice(0, 3).map((itine) => (
            <ItineraryCardItem itinerary={itine} key={itine.id} />
          ))}
        </View>
      )}
      <Link
        href={{ pathname: "/trips/[id]/itinerary", params: { id: tripId } }}
        asChild
      >
        <Pressable className="btn-primary mt-md">
          <Text className="text-on-primary">View full itinerary</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default ItineraryCard;
