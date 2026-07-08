import { View, Text, TextInput, Modal, Pressable } from "react-native";
import React from "react";

type Props = { visible: boolean; onClose: () => void };

const CreateTripModal = ({ visible, onClose }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 px-container py-xl justify-center">
        <View className="rounded-app-xl border border-outline-variant bg-surface-container-lowest p-lg">
          <View className="mb-lg flex-row items-center justify-between">
            <Text className="headline-lg text-primary">Create Trip</Text>

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
              />
            </View>

            <View className="gap-sm">
              <Text className="text-[13px] font-medium text-on-surface-variant">
                Destination
              </Text>
              <TextInput
                className="input"
                placeholder="e.g., Kyoto, Japan"
                placeholderTextColor="#6d7979"
              />
            </View>

            <View className="gap-sm">
              <Text className="text-[13px] font-medium text-on-surface-variant">
                Start Date
              </Text>
              <TextInput
                className="input"
                placeholder="Select"
                placeholderTextColor="#6d7979"
              />
            </View>

            <View className="gap-sm">
              <Text className="text-[13px] font-medium text-on-surface-variant">
                End Date
              </Text>
              <TextInput
                className="input"
                placeholder="Select"
                placeholderTextColor="#6d7979"
              />
            </View>

            <View className="gap-sm">
              <Text className="text-[13px] font-medium text-on-surface-variant">
                Cover Image
              </Text>

              <View className="h-40 items-center justify-center rounded-app-xl border-2 border-dashed border-outline-variant bg-surface-container-low">
                <Text className="text-muted">Add a cover photo</Text>
              </View>
            </View>

            <View className="gap-sm">
              <Text className="text-[13px] font-medium text-on-surface-variant">
                Description
              </Text>
              <TextInput
                className="input min-h-[110px] rounded-app-xl"
                placeholder="What's the vibe of this trip?"
                placeholderTextColor="#6d7979"
                multiline
                textAlignVertical="top"
              />
            </View>

            <Pressable className="btn-primary mt-md">
              <Text className="btn-primary-text">Create Trip</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateTripModal;
