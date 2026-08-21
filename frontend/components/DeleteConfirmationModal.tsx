import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import React from "react";
import { Trash, Trash2, X } from "lucide-react-native";
import MiniSpinner from "./MiniSpinner";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/config/toastConfig";

type Props = {
  handleClose: () => void;
  label: string;
  onPress: () => void;
  isSending: boolean;
  title: string;
};

const DeleteConfirmationModal = ({
  handleClose,
  label,
  onPress,
  isSending,
  title,
}: Props) => {
  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={isSending ? undefined : handleClose}
    >
      <View className="flex-1 justify-end bg-black/20">
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable
          style={StyleSheet.absoluteFill}
          className="bg-black/40"
          onPress={handleClose}
        />
        <View className="h-[72%] w-full overflow-hidden rounded-t-app-xl border-x border-t border-outline-variant bg-surface-container-lowest shadow-lg">
          {/* Header */}
          <View className="flex-row items-center border-b border-border-soft bg-surface-container-lowest px-container py-md">
            <Pressable
              className="btn-ghost h-11 w-11 rounded-app-full px-0"
              onPress={isSending ? undefined : handleClose}
              disabled={isSending}
            >
              <X size={28} className="text-on-surface-variant" />
            </Pressable>

            <Text className="headline-lg-mobile mr-11 flex-1 text-center">
              Delete {title}
            </Text>
          </View>

          <ScrollView className="flex-1 px-container py-lg">
            <View className="w-16 h-16 self-center rounded-full bg-error-container flex items-center justify-center mb-sm">
              <Trash
                size={32}
                className="material-symbols-outlined text-error"
              />
            </View>
            <Text className="headline-lg mb-md text-center">
              delete {title}?
            </Text>

            <View className="card-muted flex-row items-start gap-sm">
              <Text className="badge-warning badge-warning-text">info</Text>
              <Text className="text-body flex-1 text-on-surface-variant">
                Are you sure you want to delete{" "}
                <Text className="font-semibold text-on-surface text-lg">
                  {`“${label}”`}
                </Text>
                ? This action cannot be undone and will remove {title}.
              </Text>
            </View>

            <View className="flex flex-col gap-md mt-lg w-full">
              <Pressable
                className="btn-danger flex justify-center  flex-row items-center gap-2"
                onPress={onPress}
                disabled={isSending}
              >
                <Trash2 />
                {isSending ? (
                  <View className="flex flex-row items-center gap-2">
                    <Text>Deleting...</Text>
                    <MiniSpinner />
                  </View>
                ) : (
                  <Text className="btn-danger-text">Delete</Text>
                )}
              </Pressable>
              <Pressable className="btn-outline btn-full" onPress={handleClose}>
                <Text className="btn-outline-text">Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
};

export default DeleteConfirmationModal;
