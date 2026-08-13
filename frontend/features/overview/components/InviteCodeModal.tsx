import { View, Text, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import { Copy, X } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/config/toastConfig";
import { TripDetailsType } from "../types/types";
import * as Clipboard from "expo-clipboard";

type Props = { onClose: () => void; visible: boolean; trip: TripDetailsType };

const InviteCodeModal = ({ onClose, visible, trip }: Props) => {
  const [copied, setCopied] = useState(false);

  function handleClose() {
    setCopied(false);
    onClose();
  }

  async function handleCopyInviteCode() {
    await Clipboard.setStringAsync(trip.inviteCode);
    setCopied(true);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        className="flex-1 px-container py-xl justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      >
        <View className="rounded-app-xl border border-outline-variant bg-surface-container-lowest p-lg">
          <View className="mb-lg flex-row items-center justify-between">
            <Text className="headline-lg text-primary">Share Trip</Text>

            <Pressable onPress={handleClose}>
              <X />
            </Pressable>
          </View>

          <View className="gap-md">
            <View className="px-container-margin py-lg flex flex-col gap-lg">
              <Text className="font-body-md text-body-md text-on-surface-variant text-center">
                Share this code to allow others to join the {trip.title} trip.
              </Text>
              <View className="flex flex-col items-center gap-sm">
                <View className="flex items-center justify-between w-full bg-surface-container-low border border-outline-variant rounded-lg p-md gap-md">
                  <Text className="font-mono text-[25px] tracking-widest text-primary font-bold">
                    {trip.inviteCode.toUpperCase()}
                  </Text>
                  <Pressable
                    className="flex flex-row items-center justify-center btn-secondary gap-md py-sm"
                    onPress={handleCopyInviteCode}
                  >
                    <Copy />
                    <Text className="text-secondary text-xl">
                      {copied ? "Copied!" : "copy"}
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View className="w-full h-px bg-outline-variant"></View>
              <View className="flex flex-col gap-md"></View>
            </View>
          </View>
        </View>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
};

export default InviteCodeModal;
