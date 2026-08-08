import { View, Text, FlatList, TextInput, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatQueryKey } from "../lib/chatQueryKeys";
import { fetchMessages } from "../api/chat.api";
import Spinner from "@/components/Spinner";
import ChatMessageBubble from "../components/ChatMessageBubble";
import { chatSocket } from "../socket/chatSocket";
import {
  JoinTripResult,
  SavedMessage,
  SendMessageResult,
} from "../types/types";
import { Send } from "lucide-react-native";
import { createClientId } from "@/lib/createClientId";
import Toast from "react-native-toast-message";
import { addMsgToChatCache } from "../lib/addMessageToTripCache";

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

  const [textContent, setTextContent] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    function handleMessageCreated(message: SavedMessage) {
      if (message.tripId !== tripId) {
        return;
      }

      // you want to add the new message to the cached array
      addMsgToChatCache({ tripId, newMessage: message, queryClient });
    }

    // attach listener
    // It is listening for whenever someone send a message, it is sent from backend and store them in the cache
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

  function handleSendMessage() {
    const content = textContent.trim();

    if (!content || isSending) {
      return;
    }

    const clientMessageId = createClientId();

    setIsSending(true);

    chatSocket.emit(
      "message:send",
      { tripId, clientMessageId, content },
      (returnedValue: SendMessageResult) => {
        setIsSending(false);
        if (!returnedValue.ok) {
          console.error("Failed to send message:", returnedValue.error);
          Toast.show({ type: "error", text1: "Failed to send message" });
          return;
        }

        setTextContent("");

        // add newly created message to the cache
        addMsgToChatCache({
          tripId,
          newMessage: returnedValue.message,
          queryClient,
        });
      },
    );
  }

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
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
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
      <View className="flex flex-row m-md items-center">
        <TextInput
          placeholder="Type a message"
          className="h-12 rounded-xl border border-outline-variant bg-surface-container px-md text-body-lg
               text-on-surface flex-1"
          onChangeText={(text) => {
            setTextContent(text);
          }}
          value={textContent}
        />
        <Pressable
          onPress={handleSendMessage}
          disabled={isSending || !textContent.trim()}
        >
          <Send size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ChatPageClient;
