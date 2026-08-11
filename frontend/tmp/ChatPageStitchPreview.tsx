import { PlusCircle, Send } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PreviewMessage = {
  id: string;
  senderName: string;
  sentAt: string;
  text: string;
  avatarUrl?: string;
  isMine: boolean;
};

type ChatPageStitchPreviewProps = {
  keyboardVerticalOffset?: number;
  onAddPress?: () => void;
  onSend?: (content: string) => void;
};

const INITIAL_MESSAGES: PreviewMessage[] = [
  {
    id: "hiroki-1405",
    senderName: "Hiroki",
    sentAt: "14:05",
    text: "Just uploaded the JR Pass vouchers!",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASAr7EX1iy15Bpn2Eiha9cH52Akjt74PBWV2F69rg_N-1oe6EoNTKUPCUm-Ir4V3pOcQN0VhZE0tuDM3zmJczKKFkSbKdUaNlLHfo1fqSVeDSl448jKAc5OXxTq5IzSFTiNmuTOE-1yURGu7rb_o0MtDL2zzWGfrRM6IinPM6epX4RFlDyE6fDspebXDBhfKMluL8CkTQoIknx40gfQ74O6zTOG59A5Sk_LuFpRzR-FO_3m2l8PeMq36hUk526nzEb_G6RXz6mswg",
    isMine: false,
  },
  {
    id: "yuta-1412",
    senderName: "Yuta",
    sentAt: "14:12",
    text: "Awesome, thanks. I'll check them now.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXKvyFylmHW6zMdNgyRxipgOtMV5LySRK61Knscm8BuiMI28zOKEGatnlqdH1UvKlkvFEheNTCQwRViiZ9fHEEPuy1_oBsbDo671lYw6E-ZcUgDrVZjKN7TSHPa8BJ5HaqTwnVbOYfNysp4sE305-a90Yuxj5zZSh6xcbZjeBGpdHBAEg0KdX3qJ5PQ5f8g_E2uLrTfRJa5thO5O8Syg6LgL1wVdmnSnt72V0SqEpRGRn6-OGdAHaHqZqcxMGdmJnXEG_eycRX69M",
    isMine: false,
  },
  {
    id: "you-1530",
    senderName: "You",
    sentAt: "15:30",
    text: "Dinner is at 19:00 tonight, don't forget.",
    isMine: true,
  },
];

function MessageBubble({ message }: { message: PreviewMessage }) {
  if (message.isMine) {
    return (
      <View className="max-w-[85%] self-end items-end gap-unit">
        <Text className="mr-unit text-label-md font-label-md text-on-surface-variant">
          {message.sentAt}
        </Text>
        <View className="rounded-xl rounded-br-none bg-primary-container p-md shadow-sm">
          <Text className="text-body-lg font-body-lg text-on-primary-container">
            {message.text}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="max-w-[85%] flex-row items-end gap-sm self-start">
      <View className="h-8 w-8 flex-none overflow-hidden rounded-full bg-surface-container-highest">
        {message.avatarUrl ? (
          <Image
            accessibilityLabel={`${message.senderName}'s profile photo`}
            className="h-full w-full"
            resizeMode="cover"
            source={{ uri: message.avatarUrl }}
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-label-md font-label-md text-on-surface-variant">
              {message.senderName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View className="shrink gap-unit">
        <Text className="ml-unit text-label-md font-label-md text-on-surface-variant">
          {message.senderName} • {message.sentAt}
        </Text>
        <View className="rounded-xl rounded-bl-none bg-surface-container-high p-md shadow-sm">
          <Text className="text-body-lg font-body-lg text-on-surface">
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function ChatPageStitchPreview({
  keyboardVerticalOffset = 80,
  onAddPress,
  onSend,
}: ChatPageStitchPreviewProps) {
  const [messages, setMessages] = useState<PreviewMessage[]>(INITIAL_MESSAGES);
  const [content, setContent] = useState("");
  const trimmedContent = content.trim();

  function handleSend() {
    if (!trimmedContent) {
      return;
    }

    onSend?.(trimmedContent);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `preview-${Date.now()}`,
        senderName: "You",
        sentAt: new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
        text: trimmedContent,
        isMine: true,
      },
    ]);
    setContent("");
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface-bright"
      edges={["left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <FlatList
          contentContainerStyle={{ gap: 24, padding: 16, paddingBottom: 24 }}
          data={messages}
          keyExtractor={(message) => message.id}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View className="w-full items-center">
              <View className="rounded-full bg-surface-container-high px-md py-xs">
                <Text className="text-label-md font-label-md text-on-surface-variant">
                  Today
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => <MessageBubble message={item} />}
        />

        <View className="flex-row items-center gap-sm border-t border-outline-variant bg-surface px-md py-sm shadow-sm">
          <Pressable
            accessibilityLabel="Add attachment"
            accessibilityRole="button"
            className="h-10 w-10 flex-none items-center justify-center rounded-full active:bg-secondary-container"
            hitSlop={8}
            onPress={onAddPress}
          >
            <PlusCircle color="#3d4949" size={24} />
          </Pressable>

          <View className="min-h-11 flex-1 flex-row items-center rounded-full border border-outline-variant bg-surface-container-low px-md">
            <TextInput
              accessibilityLabel="Message"
              className="flex-1 py-sm text-body-md font-body-md text-on-surface"
              onChangeText={setContent}
              onSubmitEditing={handleSend}
              placeholder="Type a message..."
              placeholderTextColor="#3d4949"
              returnKeyType="send"
              value={content}
            />
          </View>

          <Pressable
            accessibilityLabel="Send message"
            accessibilityRole="button"
            className="h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-container active:opacity-80 disabled:opacity-40"
            disabled={!trimmedContent}
            hitSlop={8}
            onPress={handleSend}
          >
            <Send color="#004444" fill="#004444" size={21} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
