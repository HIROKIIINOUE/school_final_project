import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = { tripId: string };

const ChatPageClient = ({ tripId }: Props) => {
  // fetch messages for this trip and displays
  return (
    <SafeAreaView>
      <Text>ChatPageClient</Text>
    </SafeAreaView>
  );
};

export default ChatPageClient;
