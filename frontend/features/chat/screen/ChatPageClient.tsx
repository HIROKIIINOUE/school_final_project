import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatQueryKey } from "../lib/chatQueryKeys";
import { fetchMessages } from "../api/chat.api";
import Spinner from "@/components/Spinner";
import ChatMessageBubble from "../components/ChatMessageBubble";
import { chatSocket } from "../socket/chatSocket";
import { JoinTripResult, SavedMessage } from "../types/types";

type Props = { tripId: string };

const ChatPageClient = ({ tripId }: Props) => {
  // fetch messages for this trip and cache with TanstackQuery
  const {
    isPending,
    isError,
    error,
    data: messages,
  } = useQuery({
    queryKey: chatQueryKey.byTrip(tripId),
    queryFn: () => fetchMessages({ tripId }),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    function handleMessageCreated(message: SavedMessage) {
      if (message.tripId !== tripId) {
        return;
      }

      // you want to add the new message to the cached array
      queryClient.setQueryData<SavedMessage[]>(
        ["tripMessages", tripId],
        (oldMessages) => {
          // if old messages don't exist, the new message becomes the first msg
          if (!oldMessages) {
            return [message];
          }

          const alreadyExists = oldMessages.some(
            (existingMessage) => existingMessage.id === message.id,
          );

          if (alreadyExists) {
            return oldMessages;
          }

          return [...oldMessages, message];
        },
      );
    }

    // attach listener
    chatSocket.on("message:created", handleMessageCreated);

    // on page load, user should join the trip automatically
    chatSocket.emit("trip:join", { tripId }, (result: JoinTripResult) => {
      if (!result.ok) {
        console.error("Failed to join trip chat:", result.error);
        return;
      }
      console.log("Joined trip chat:", result.tripId);
    });

    return () => {
      // removing this listener function
      chatSocket.off("message:created", handleMessageCreated);
    };
  }, [tripId]);

  // loading chat messages...
  if (isPending) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner message="Loading your chat..." />
      </SafeAreaView>
    );
  }

  // If there is an error
  // eventually retry button
  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Failed to load messages.</Text>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>ChatPageClient</Text>
      <Text>{messages.length}</Text>
      <FlatList
        keyExtractor={(message) => message.id}
        data={messages}
        renderItem={({ item: message }) => (
          <ChatMessageBubble message={message} />
        )}
        ListEmptyComponent={<Text>No messages yet</Text>}
      ></FlatList>
    </SafeAreaView>
  );
};

export default ChatPageClient;
