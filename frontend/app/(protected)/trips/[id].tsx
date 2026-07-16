import { View, Text } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
import OverView from "@/features/overview/screens/Overview";

const Temp = () => {
  const { id } = useLocalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;
  return <OverView id={tripId} />;
};

export default Temp;
