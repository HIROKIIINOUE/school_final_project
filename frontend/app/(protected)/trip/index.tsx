import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";

import { mockTripRooms } from "@/features/trips/data/dummyRoomData";
import MytripHeader from "@/components/trips/MytripHeader";
import CreateTripModal from "@/features/trips/CreateTripModal";

const index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  return (
    <View className="relative">
      {isCreateModalOpen && (
        <CreateTripModal
          visible={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
      <MytripHeader />
      <View className="flex flex-row items-center justify-center w-full">
        <Pressable
          className="btn-primary my-lg mx-md"
          onPress={() => setIsCreateModalOpen(true)}
        >
          <Text>Create Trip</Text>
        </Pressable>
        <Pressable className="btn-secondary my-lg mx-md">
          <Text>Create Trip</Text>
        </Pressable>
      </View>
      <View className="gap-md px-sm">
        {mockTripRooms.map((room) => (
          <Pressable key={room.id} className="card">
            <View className="absolute top-0 left-0 w-1 h-full bg-primary" />

            <View className="flex flex-row justify-between items-start pl-sm">
              <View>
                <Text className="font-sans text-[18px] font-semibold leading-lg text-on-surface truncate">
                  {room.title}
                </Text>
              </View>

              <View className="px-sm py-xs rounded-app-full flex-row items-center gap-xs shrink-0">
                {/* <MaterialIcons name="star" size={14} className="text-primary" /> */}
                {/* TODO: insert ICON above */}
                <Text
                  className={`font-sans font-medium uppercase leading-[16px] ${room.isOwner ? "badge-primary" : "badge-secondary"}`}
                >
                  {room.isOwner ? "Owner" : "Member"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-sm pl-sm pt-sm border-t border-outline-variant/50">
              {/* <MaterialIcons name="group" size={20} className="text-on-surface-variant" /> */}
              <Text className="font-sans text-[14px] font-normal leading-container text-on-surface-variant">
                {room.memberCount} members
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default index;
