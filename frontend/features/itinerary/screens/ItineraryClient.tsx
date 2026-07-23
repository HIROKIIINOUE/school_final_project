import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ItineraryInput } from "../types/types";
import { fetchItineraries } from "../api/itinerary.api";
import { formateDate } from "@/lib/formatDate";
import IndivisualItinerary from "../components/IndivisualItinerary";
import { Plus } from "lucide-react-native";

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
    const formattedDate = formateDate(new Date(item.startTime));
    const currentItems = dateMap.get(formattedDate) ?? [];

    currentItems.push(item);
    dateMap.set(formattedDate, currentItems);
  }

  // display itineararies
  return (
    <ScrollView>
      {Array.from(dateMap.entries()).map(([key, value]) => (
        <IndivisualItinerary date={key} itineraries={value} />
      ))}

      <Plus className="material-symbols-outlined" />
    </ScrollView>
  );
};

export default ItineraryClient;
