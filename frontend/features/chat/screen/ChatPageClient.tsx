import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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
import { useAuthStore } from "@/store/auth.store";

type Props = { tripId: string };
type MessageCommand = { clientMessageId: string; content: string };

const ChatPageClient = ({ tripId }: Props) => {
  // fetch messages for this trip and cache with TanstackQuery on page load
  // useQuery() handles the initial fetch-and-cache process for me
  const {
    isPending,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: chatQueryKey.byTrip(tripId),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      fetchMessages({ tripId, before: pageParam ?? undefined }),
    getNextPageParam: (lastPage) => {
      return lastPage.olderCursor ?? undefined;
    },
  });

  const messages = data
    ? [...data.pages].reverse().flatMap((page) => page.messages)
    : [];

  const [textContent, setTextContent] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<MessageCommand | null>(
    null,
  );

  const listRef = useRef<FlatList<SavedMessage>>(null);

  const didInitialScroll = useRef(false);

  const currentUserId = useAuthStore((state) => state.user?.id);

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

    // cleanup function : It runs when components unmount (like, user leaves the page), or before re-running
    return () => {
      // removing this listener function
      chatSocket.off("message:created", handleMessageCreated);
      chatSocket.off("connect", handleConnect);

      // when user leaves, it should disconnect joined room
      if (chatSocket.connected) {
        chatSocket.emit("trip:leave", { tripId });
      }
    };
  }, [tripId, queryClient]);

  // first try sending message
  function handleSendMessage() {
    const content = textContent.trim();

    // only allows message-send when content exists, no-sending, np pendingMessage
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
          // no longer sending
          setIsSending(false);

          if (timeoutError) {
            Toast.show({ type: "error", text1: "Message send timed out" });

            return;
          }

          // it reached the backend = no retry
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

  function handleStartReached() {
    if (!didInitialScroll.current) {
      return;
    }

    if (!hasNextPage) {
      return;
    }

    if (isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  }

  // loading chat messages...
  if (isPending) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-surface-bright">
        <Spinner message="Loading your chat..." />
      </SafeAreaView>
    );
  }

  // If there is an error
  // eventually retry button
  if (isError) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="flex-1 items-center justify-center gap-sm bg-surface-bright px-md"
        edges={["left", "right"]}
      >
        <Text className="text-title-md font-title-md text-on-surface">
          Failed to load messages.
        </Text>
        <Text className="text-center text-body-md font-body-md text-on-surface-variant">
          {error.message}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="flex-1 bg-surface-bright"
      edges={["left", "right"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={80}
      >
        {
          // retry logic
          pendingMessage && !isSending && (
            <Pressable
              className="btn-secondary btn-small mx-md mt-sm self-start"
              onPress={() => {
                sendMessageCommand(pendingMessage);
              }}
            >
              <Text className="btn-secondary-text">Retry</Text>
            </Pressable>
          )
        }

        <FlatList
          className="chat-list"
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          ref={listRef}
          contentContainerClassName="gap-lg px-md py-lg"
          keyExtractor={(message) => message.id}
          data={messages}
          renderItem={({ item: message }) => (
            <ChatMessageBubble
              message={message}
              currentUserId={currentUserId!}
            />
          )}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          // ListHeaderComponent={
          //   <View className="w-full items-center">
          //     <View className="rounded-full bg-surface-container-high px-md py-xs">
          //       <Text className="text-label-md font-label-md text-on-surface-variant">
          //         Today
          //       </Text>
          //     </View>
          //   </View>
          // }
          ListEmptyComponent={
            <Text className="empty-title empty-inline">No messages yet</Text>
          }
          onContentSizeChange={() => {
            if (!didInitialScroll.current && messages.length > 0) {
              listRef.current?.scrollToEnd({ animated: false });

              didInitialScroll.current = true;
              // only send the user to the newest on initial load = shouldn't bring user to the bottom on every pagination
            }
          }}
          onStartReached={handleStartReached}
          onStartReachedThreshold={0.1}
        />
        <View className="chat-input-bar">
          <TextInput
            placeholder="Type a message"
            accessibilityLabel="Message"
            className="input flex-1 rounded-app-full"
            onChangeText={(text) => {
              setTextContent(text);
            }}
            value={textContent}
            placeholderTextColor="#3d4949"
            editable={!pendingMessage} // when there is a pendingMessage, user shouldn't be able to edit
          />
          <Pressable
            onPress={handleSendMessage}
            disabled={isSending || !!pendingMessage || !textContent.trim()}
            accessibilityLabel="Send message"
            accessibilityRole="button"
            className="btn-primary h-11 w-11 flex-none rounded-app-full px-0 disabled:opacity-40"
          >
            <Send size={20} color="#004444" fill="#004444" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPageClient;
