import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { ItineraryInput } from "../types/types";
import { fetchItineraries } from "../api/itinerary.api";
import { getDateKey } from "@/lib/formatDate";
import IndivisualItinerary from "../components/IndivisualItinerary";
import { Plus } from "lucide-react-native";
import { Link } from "expo-router";

type Props = { tripId: string };

const ItineraryClient = ({ tripId }: Props) => {
  const [itineraryItems, setItineraryItems] = useState<ItineraryInput[]>([]);

  // get the itineraries for this trip on load
  useEffect(() => {
    async function fetchAndSetItineraries() {
      const itineraries = await fetchItineraries(tripId);
      setItineraryItems(itineraries);
    }

    fetchAndSetItineraries();
  }, []);

  // set Itineraries by date:
  // goal output : [ { "Aug 3": [itinerariItems] }, { "Aug 4": [itineraryItems] }... ]
  const dateMap = new Map();

  for (const item of itineraryItems) {
    const formattedDate = getDateKey(new Date(item.startTime));
    const currentItems = dateMap.get(formattedDate) ?? [];

    currentItems.push(item);
    dateMap.set(formattedDate, currentItems);
  }

  if (itineraryItems.length === 0) {
    return (
      <View className="m-sm">
        <Text className="text-center text-xl text-muted">
          No Itineraries created yet
        </Text>
        <Link
          href={{
            pathname: "/trips/[id]/itinerary/create-itinerary",
            params: { id: tripId },
          }}
          asChild
        >
          <Pressable className="btn-primary mt-md">
            <Text className="text-on-primary">Create Itinerary here</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  // display itineararies
  return (
    <ScrollView className="screen">
      {Array.from(dateMap.entries()).map(([key, value]) => (
        <IndivisualItinerary date={key} itineraries={value} key={key} />
      ))}

      <Plus className="material-symbols-outlined" />
    </ScrollView>
  );
};

export default ItineraryClient;
