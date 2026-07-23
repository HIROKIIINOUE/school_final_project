import React from "react";
import { useLocalSearchParams } from "expo-router";
import ItineraryClient from "@/features/itinerary/screens/ItineraryClient";

const index = () => {
  const { id } = useLocalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;
  return <ItineraryClient tripId={tripId} />;
};

export default index;
