import React from "react";
import { useGlobalSearchParams } from "expo-router";
import OverView from "@/features/overview/screens/Overview";
import { Text } from "react-native";

const Temp = () => {
  const { id } = useGlobalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;
  if (!tripId) {
    return <Text>Invalid trip route.</Text>;
  }
  return <OverView id={tripId} />;
};

export default Temp;
