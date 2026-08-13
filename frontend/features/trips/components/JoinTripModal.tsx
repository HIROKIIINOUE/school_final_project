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
import { PlaneTakeoff, X } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { joinTrip } from "../api/myRoom.api";
import { useRouter } from "expo-router";
import { toastConfig } from "@/config/toastConfig";
import MiniSpinner from "@/components/MiniSpinner";
import { useQueryClient } from "@tanstack/react-query";

type Props = { closeModal: () => void };

const JoinTripModal = ({ closeModal }: Props) => {
  const queryClient = useQueryClient();

  const [inviteCode, setInviteCode] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const router = useRouter();

  async function onPress() {
    const normalizedInviteCode = inviteCode.trim();
    if (!normalizedInviteCode) {
      Toast.show({ type: "error", text1: "invite code is required" });
      return;
    }
    try {
      setIsSending(true);
      const result = await joinTrip({ inviteCode: normalizedInviteCode });
      queryClient.invalidateQueries({ queryKey: ["myTrips"] });
      setInviteCode("");
      Toast.show({ type: "success", text1: "Successfully joined the trip" });
      closeModal();
      router.navigate(`/(protected)/trips/${result.trip.id}/(tabs)`);
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
              Join Trip
            </Text>
          </View>

          <ScrollView className="flex-1 px-container py-lg">
            <Text className="text-body-lg mb-lg text-center text-on-surface-variant">
              Enter the invite code shared by your group.
            </Text>
            <View className="form-group mb-lg">
              <Text className="label">Invite Code</Text>
              <View className="relative">
                <TextInput
                  className="input min-h-13 w-full border-primary-container text-[16px] uppercase tracking-[0.16em]"
                  placeholder="e.g. A8B29C"
                  onChangeText={(code) => setInviteCode(code.toUpperCase())}
                  value={inviteCode}
                />
              </View>
            </View>
            <View className="card-muted flex-row items-start gap-sm">
              <Text className="badge-primary badge-primary-text">info</Text>
              <Text className="text-body flex-1 text-on-surface-variant">
                Invite codes are typically a 12-character alphanumeric code sent
                via email or shared directly by the trip owner.
              </Text>
            </View>
          </ScrollView>
          <View className="mt-auto gap-sm border-t border-border-soft bg-surface-container-lowest px-container py-md">
            <Pressable
              className="btn-primary btn-full disabled:opacity-50 gap-2"
              onPress={onPress}
              disabled={isSending}
            >
              <PlaneTakeoff className="mr-sm h-5 w-5 text-on-primary" />
              {isSending ? (
                <View className="flex flex-row items-center gap-2">
                  <Text>Joining...</Text>
                  <MiniSpinner />
                </View>
              ) : (
                <Text className="btn-primary-text">Join</Text>
              )}
            </Pressable>
            <Pressable className="btn-outline btn-full" onPress={closeModal}>
              <Text className="btn-outline-text"> Cancel </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
};

export default JoinTripModal;
