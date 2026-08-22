import { Text } from "react-native";
import React from "react";
import { useGlobalSearchParams } from "expo-router";
import BookingScreen from "@/features/booking/screen/BookingScreen";

const BookingRoute = () => {
  const { id } = useGlobalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;
  if (!tripId) {
    return <Text>Invalid trip route.</Text>;
  }

  return <BookingScreen tripId={tripId} />;
};

export default BookingRoute;
