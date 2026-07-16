import { View, Text, TextInput, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import { createMyTrips } from "../api/myRoom.api";
import { useRouter } from "expo-router";
import KeyboardDissmissBtn from "@/components/KeyboardDissmissBtn";

type Props = { visible: boolean; onClose: () => void };

const CreateTripModal = ({ visible, onClose }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const router = useRouter();

  async function handleSubmit() {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      // toast error
      console.log("Title is required");
      return;
    }
    const normalizedDes = description.trim() === "" ? null : description.trim();
    try {
      setIsCreating(true);
      console.log(normalizedTitle, normalizedDes);
      const data = await createMyTrips({
        title: normalizedTitle,
        description: normalizedDes,
      });

      // toast successful message
      // redirect to trip room
      router.replace(`/trips/${data.id}`);
    } catch (e) {
      // toast error
      console.error("Failed to create trip", e);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        className="flex-1 px-container py-xl justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      >
        <View className="rounded-app-xl border border-outline-variant bg-surface-container-lowest p-lg">
          <View className="mb-lg flex-row items-center justify-between">
            <Text className="headline-lg text-primary">Create Trip</Text>
            <KeyboardDissmissBtn />

            <Pressable onPress={onClose}>
              <Text className="text-body text-primary">Close</Text>
            </Pressable>
          </View>

          <View className="gap-md">
            <View className="gap-sm">
              <Text className="text-[13px] font-medium text-on-surface-variant">
                Trip Name
              </Text>
              <TextInput
                className="input"
                placeholder="e.g., Summer in Kyoto"
                placeholderTextColor="#6d7979"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View className="gap-sm">
              <Text className="text-[13px] font-medium text-on-surface-variant">
                Description
              </Text>
              <TextInput
                className="input min-h-27.5 rounded-app-xl"
                placeholder="What's the vibe of this trip?"
                placeholderTextColor="#6d7979"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <Pressable
              className="btn-primary mt-md"
              onPress={handleSubmit}
              disabled={isCreating}
            >
              <Text className="btn-primary-text">Create Trip</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateTripModal;
