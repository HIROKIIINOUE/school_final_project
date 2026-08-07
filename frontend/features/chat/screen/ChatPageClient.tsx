import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { chatQueryKey } from "../lib/chatQueryKeys";
import { fetchMessages } from "../api/chat.api";

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

  return (
    <SafeAreaView>
      <Text>ChatPageClient</Text>
    </SafeAreaView>
  );
};

export default ChatPageClient;
