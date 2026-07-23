import { View, Text, Pressable } from "react-native";
import React from "react";
import { TripRoom } from "@/features/trips/data/dummyRoomData";
import { useRouter } from "expo-router";

type Props = { room: TripRoom };

const TripRoomCard = ({ room }: Props) => {
  const router = useRouter();

  function handleOnpress() {
    router.replace(`/(protected)/trips/${room.id}`);
  }
  return (
    <Pressable className="card" onPress={handleOnpress}>
      <View className="absolute top-0 left-0 w-1 h-full bg-primary" />

      <View className="flex flex-row justify-between items-start pl-sm ">
        <View className="flex-1">
          <Text
            className="font-sans text-[18px] font-semibold leading-lg text-on-surface"
            numberOfLines={1}
          >
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
  );
};

export default TripRoomCard;
