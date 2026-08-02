import React from "react";
import { useGlobalSearchParams } from "expo-router";
import ItineraryClient from "@/features/itinerary/screens/ItineraryClient";
import { Text } from "react-native";

const index = () => {
  const { id } = useGlobalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;
  console.log(tripId);
  if (!tripId) {
    return <Text>Invalid trip route.</Text>;
  }
  return <ItineraryClient tripId={tripId} />;
};

export default index;
