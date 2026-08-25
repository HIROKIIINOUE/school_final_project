import React from "react";
import { useGlobalSearchParams } from "expo-router";
import { ItineraryClient } from "@/features/itinerary/screens/ItineraryClient";
import { Text } from "react-native";

const ItineraryRoute = () => {
  const { id } = useGlobalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;

  if (!tripId) {
    return <Text>Invalid trip route.</Text>;
  }

  return <ItineraryClient tripId={tripId} />;
};

export default ItineraryRoute;
