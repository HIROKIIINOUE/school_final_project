import { View, Text, Image } from "react-native";
import React from "react";
import { SavedMessage } from "../types/types";

type Props = { message: SavedMessage; currentUserId: string };

const ChatMessageBubble = ({ message, currentUserId }: Props) => {
  const isMine = message.sender.id === currentUserId;

  if (isMine) {
    return (
      <View className="max-w-[85%] self-end items-end gap-unit">
        <Text className="mr-unit text-label-md font-label-md text-on-surface-variant">
          {message.createdAt}
        </Text>
        <View className="rounded-xl rounded-br-none bg-primary-container p-md shadow-sm">
          <Text className="text-body-lg font-body-lg text-on-primary-container">
            {message.content}
          </Text>
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

      <View className="shrink gap-unit">
        <Text className="ml-unit text-label-md font-label-md text-on-surface-variant">
          {message.sender.displayName} • {message.createdAt}
        </Text>
        <View className="rounded-xl rounded-bl-none bg-surface-container-high p-md shadow-sm">
          <Text className="text-body-lg font-body-lg text-on-surface">
            {message.content}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ChatMessageBubble;
