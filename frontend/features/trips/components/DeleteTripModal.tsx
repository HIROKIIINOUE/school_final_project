import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { PlaneTakeoff, Trash, Trash2, X } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { deleteTrip, joinTrip } from "../api/myRoom.api";
import { useRouter } from "expo-router";
import { toastConfig } from "@/config/toastConfig";
import MiniSpinner from "@/components/MiniSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { tripQueryKey } from "../lib/tripQueryKeys";
import { MyRoomType } from "../types/types";

type Props = { closeModal: () => void; trip: MyRoomType };

const DeleteTripModal = ({ closeModal, trip }: Props) => {
  const queryClient = useQueryClient();

  const [isSending, setIsSending] = useState<boolean>(false);

  async function onPress() {
    try {
      setIsSending(true);
      const result = await deleteTrip({ tripId: trip.id });
      console.log(result);
      Toast.show({ type: "success", text1: "Successfully delete the trip" });
      queryClient.invalidateQueries({ queryKey: tripQueryKey.all });
      closeModal();
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to join trip";
      Toast.show({ type: "error", text1: errorMsg });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={closeModal}
    >
      <View className="flex-1 justify-end bg-black/20">
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable
          style={StyleSheet.absoluteFill}
          className="bg-black/40"
          onPress={closeModal}
        />
        <View className="h-[72%] w-full overflow-hidden rounded-t-app-xl border-x border-t border-outline-variant bg-surface-container-lowest shadow-lg">
          {/* Header */}
          <View className="flex-row items-center border-b border-border-soft bg-surface-container-lowest px-container py-md">
            <Pressable
              className="btn-ghost h-11 w-11 rounded-app-full px-0"
              onPress={closeModal}
            >
              <X size={28} className="text-on-surface-variant" />
            </Pressable>

            <Text className="headline-lg-mobile mr-11 flex-1 text-center">
              Delete Trip
            </Text>
          </View>

          <ScrollView className="flex-1 px-container py-lg">
            <View className="w-16 h-16 self-center rounded-full bg-error-container flex items-center justify-center mb-sm">
              <Trash
                size={32}
                className="material-symbols-outlined text-error"
              />
            </View>
            <Text className="headline-lg mb-md text-center">delete trip?</Text>

            <View className="card-muted flex-row items-start gap-sm">
              <Text className="badge-warning badge-warning-text">info</Text>
              <Text className="text-body flex-1 text-on-surface-variant">
                Are you sure you want to delete{" "}
                <Text className="font-semibold text-on-surface text-lg">
                  '{trip.title}'
                </Text>
                ? This action cannot be undone and will remove all itinerary
                items, bookings, and shared expenses for all members.
              </Text>
            </View>

            <View className="flex flex-col gap-md mt-lg w-full">
              <Pressable
                className="btn-danger flex justify-center  flex-row items-center gap-2"
                onPress={onPress}
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
              <Pressable className="btn-outline btn-full" onPress={closeModal}>
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

export default DeleteTripModal;
