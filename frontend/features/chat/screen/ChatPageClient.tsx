import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { chatQueryKey } from "../lib/chatQueryKeys";
import { fetchMessages } from "../api/chat.api";
import Spinner from "@/components/Spinner";
import ChatMessageBubble from "../components/ChatMessageBubble";

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

  // loading chat messages...
  if (isPending) {
    return (
      <SafeAreaView>
        <Spinner message="Loading your chat..." />
      </SafeAreaView>
    );
  }

  // If there is an error
  // eventually retry button
  if (isError) {
    return (
      <SafeAreaView>
        <Text>Failed to load messages.</Text>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
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
