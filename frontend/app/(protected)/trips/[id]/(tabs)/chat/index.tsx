import { Text } from "react-native";
import React from "react";
import { useGlobalSearchParams } from "expo-router";
import ChatPageClient from "@/features/chat/screen/ChatPageClient";

const ChatRoute = () => {
  const { id } = useGlobalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;
  if (!tripId) {
    return <Text>Invalid trip route.</Text>;
  }

  return <ChatPageClient tripId={tripId} />;
};

export default ChatRoute;
