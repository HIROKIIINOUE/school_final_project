import { View, Text, Pressable } from "react-native";
import React from "react";

import { mockTripRooms } from "@/features/trips/data/dummyRoomData";

const index = () => {
  return (
    <View className="gap-md">
      {mockTripRooms.map((room) => (
        <Pressable key={room.id} className="card">
          <View className="absolute top-0 left-0 w-1 h-full bg-primary" />

          <View className="flex-row justify-between items-start pl-sm">
            <View>
              <Text className="font-sans text-[18px] font-semibold leading-[24px] text-on-surface">
                {room.title}
              </Text>
            </View>

            <View className="px-sm py-xs rounded-app-full flex-row items-center gap-xs shrink-0">
              {/* <MaterialIcons name="star" size={14} className="text-primary" /> */}
              {/* TODO: insert ICON above */}
              <Text
                className={`font-sans text-[12px] font-medium uppercase leading-[16px] ${room.isOwner ? "badge-primary" : "badge-secondary"}`}
              >
                {room.isOwner ? "Owner" : "Member"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-sm pl-sm pt-sm border-t border-outline-variant/50">
            {/* <MaterialIcons name="group" size={20} className="text-on-surface-variant" /> */}
            <Text className="font-sans text-[14px] font-normal leading-[20px] text-on-surface-variant">
              {room.memberCount} members
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default index;
