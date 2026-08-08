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
type MessageCommand = { clientMessageId: string; content: string };

const ChatPageClient = ({ tripId }: Props) => {
  // fetch messages for this trip and cache with TanstackQuery on page load
  // useQuery() handles the initial fetch-and-cache process for me
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
  const [pendingMessage, setPendingMessage] = useState<MessageCommand | null>(
    null,
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    function handleMessageCreated(message: SavedMessage) {
      if (message.tripId !== tripId) {
        return;
      }

      // you want to add the new message to the cached array
      addMsgToChatCache({ tripId, newMessage: message, queryClient });
    }

    function joinCurrentTrip({
      needRepair = false,
    }: { needRepair?: boolean } = {}) {
      chatSocket.emit("trip:join", { tripId }, (result: JoinTripResult) => {
        if (!result.ok) {
          console.error("Failed to join trip chat:", result.error);
          return;
        }
        console.log("Joined trip chat:", result.tripId);

        // if reconnecting connection again, it has to trigger re-fetch messages from backend
        if (needRepair) {
          // invalidateQueries = trigger backend fetch
          queryClient.invalidateQueries({
            queryKey: chatQueryKey.byTrip(tripId),
          });
        }
      });
    }

    function handleConnect() {
      joinCurrentTrip({ needRepair: true });
    }

    // attach listener
    // It is listening for whenever someone send a message, it is sent from backend and store them in the cache
    chatSocket.on("message:created", handleMessageCreated);

    chatSocket.on("connect", handleConnect); // whenever connected, has to re-fetch messages

    // on page load, socket might be connected already => in that case you have to trigger trip:join here
    if (chatSocket.connected) {
      joinCurrentTrip();
    }

    return () => {
      // removing this listener function
      chatSocket.off("message:created", handleMessageCreated);
      chatSocket.off("connect", handleConnect);
    };
  }, [tripId, queryClient]);

  // first try sending message
  function handleSendMessage() {
    const content = textContent.trim();

    if (!content || isSending || pendingMessage) {
      return;
    }

    const command = { clientMessageId: createClientId(), content };

    setPendingMessage(command);

    sendMessageCommand(command);
  }

  // actual sending message logic itself
  function sendMessageCommand(command: MessageCommand) {
    setIsSending(true);

    chatSocket
      .timeout(5000)
      .emit(
        "message:send",
        {
          tripId,
          clientMessageId: command.clientMessageId,
          content: command.content,
        },
        (timeoutError: Error | null, returnedValue: SendMessageResult) => {
          setIsSending(false);
          if (timeoutError) {
            Toast.show({ type: "error", text1: "Message send timed out" });

            return;
          }

          if (!returnedValue.ok) {
            setPendingMessage(null);
            console.error("Failed to send message:", returnedValue.error);
            Toast.show({ type: "error", text1: "Failed to send message" });
            return;
          }

          // if successfull
          setPendingMessage(null);
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
      {
        // retry logic
        pendingMessage && !isSending && (
          <Pressable
            onPress={() => {
              sendMessageCommand(pendingMessage);
            }}
          >
            <Text>Retry</Text>
          </Pressable>
        )
      }
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
          disabled={isSending || !!pendingMessage || !textContent.trim()}
        >
          <Send size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ChatPageClient;
