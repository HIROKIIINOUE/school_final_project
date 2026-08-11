import { View, Text, Image } from "react-native";
import React from "react";
import { SavedMessage } from "../types/types";
import { formatDayLabel, formatTime } from "@/lib/formatDate";

type Props = { message: SavedMessage; currentUserId: string };

const ChatMessageBubble = ({ message, currentUserId }: Props) => {
  const isMine = message.sender.id === currentUserId;

  const formattedTime = formatTime(new Date(message.createdAt));

  if (isMine) {
    return (
      <View className="max-w-[80%] self-end items-end ">
        <Text className="chat-meta mr-unit">{formattedTime}</Text>
        <View className="chat-bubble chat-bubble-me rounded-br-none shadow-lg">
          <Text className="chat-text-me">{message.content}</Text>
        </View>
      </View>
    );
  }
  return (
    <View className="max-w-[85%] flex-row items-end gap-sm self-start">
      <View className="h-8 w-8 flex-none overflow-hidden rounded-full bg-surface-container-highest">
        {message.sender.image ? (
          <Image
            accessibilityLabel={`${message.sender.displayName}'s profile photo`}
            className="h-full w-full"
            resizeMode="cover"
            source={{ uri: message.sender.image }}
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-label-md font-label-md text-on-surface-variant">
              {message.sender.displayName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View className="max-w-[80%] shrink">
        <Text className="chat-meta ml-unit">
          {message.sender.displayName} • {formattedTime}
        </Text>
        <View className="chat-bubble chat-bubble-other rounded-bl-none shadow-sm">
          <Text className="chat-text-other">{message.content}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatMessageBubble;
