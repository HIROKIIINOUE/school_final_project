import { View, Text } from "react-native";
import React from "react";
import { SavedMessage } from "../types/types";

type Props = { message: SavedMessage; currentUserId: string };

const ChatMessageBubble = ({ message, currentUserId }: Props) => {
  return (
    <View>
      <Text>{message.sender.displayName}</Text>
      <Text>{message.content}</Text>
    </View>
  );
};

export default ChatMessageBubble;
