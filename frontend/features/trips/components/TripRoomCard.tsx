import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SquarePen, Trash2 } from "lucide-react-native";
import CreateTripModal from "./CreateTripModal";
import { MyRoomType } from "../types/types";

type Props = { room: MyRoomType };

const TripRoomCard = ({ room }: Props) => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function handleOnpress() {
    router.navigate(`/(protected)/trips/${room.id}/(tabs)`);
  }

  function onEditPress() {
    setIsModalOpen(true);
  }

  return (
    <View className="flex flex-row gap-sm">
      <Pressable className="card flex-1" onPress={handleOnpress}>
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
      <View className="w-20 flex-row overflow-hidden rounded-r-lg">
        <Pressable
          className="flex-1 items-center justify-center bg-primary-container w-10"
          onPress={onEditPress}
        >
          <SquarePen />
        </Pressable>
        <Pressable className="flex-1 items-center justify-center bg-error/70 w-10">
          <Trash2 />
        </Pressable>
      </View>
      {isModalOpen && (
        <CreateTripModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tripData={room}
        />
      )}
    </View>
  );
};

export default TripRoomCard;
