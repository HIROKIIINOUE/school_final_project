import { View, Text } from "react-native";
import React from "react";

type Props = { tripId: string };

const ChatPageClient = ({ tripId }: Props) => {
  // fetch messages for this trip and displays
  return (
    <View>
      <Text>ChatPageClient</Text>
    </View>
  );
};

export default ChatPageClient;
