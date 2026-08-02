import { View, Text } from "react-native";
import React from "react";
import { useGlobalSearchParams } from "expo-router";
import ChatPageClient from "@/features/chat/screen/ChatPageClient";

const index = () => {
  const { id } = useGlobalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;
  console.log(tripId);
  if (!tripId) {
    return <Text>Invalid trip route.</Text>;
  }

  return <ChatPageClient tripId={tripId} />;
};

export default index;
