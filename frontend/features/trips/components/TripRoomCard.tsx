import { View, Text, Pressable } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { CalendarDays, SquarePen, Trash2, Users } from "lucide-react-native";
import CreateTripModal from "./CreateTripModal";
import { MyRoomType } from "../types/types";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import DeleteTripModal from "./DeleteTripModal";
import { formatDayLabel } from "@/lib/formatDate";

type Props = { room: MyRoomType };

const TripRoomCard = ({ room }: Props) => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const swipeableRef = useRef<SwipeableMethods | null>(null);

  useFocusEffect(
    useCallback(() => {
      return swipeableRef.current?.close();
    }, []),
  );

  function handleOnpress() {
    router.push(`/(protected)/trips/${room.id}/(tabs)`);
  }

  function onEditPress() {
    setIsModalOpen(true);
  }

  function renderRightAction() {
    return (
      <View className="w-40 flex-row overflow-hidden rounded-r-lg">
        <Pressable
          className="flex-1 items-center justify-center bg-primary-container w-10"
          onPress={onEditPress}
        >
          <SquarePen />
        </Pressable>
        {room.isOwner && (
          <Pressable
            className="flex-1 items-center justify-center bg-error/70 w-10"
            onPress={() => setDeleteModalOpen(true)}
          >
            <Trash2 />
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightAction}
      rightThreshold={50}
      friction={2}
      overshootRight={false}
    >
      <View className="flex flex-row gap-sm">
        <Pressable className="card flex-1" onPress={handleOnpress}>
          <View className="absolute top-0 left-0 w-1 h-full bg-primary" />

          <View className="flex flex-row justify-between items-start pl-sm ">
            <View className="flex-1 gap-md">
              <Text
                className="font-sans text-[18px] font-semibold leading-lg text-on-surface"
                numberOfLines={1}
              >
                {room.title}
              </Text>
            </View>

            <View
              className={`${room.isOwner ? "badge-success" : "badge-secondary"} flex-row items-center gap-xs shrink-0`}
            >
              <Text
                className={
                  room.isOwner ? "badge-success-text" : "badge-secondary-text"
                }
              >
                {room.isOwner ? "Owner" : "Member"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-sm pl-sm pt-sm border-t border-outline-variant/50">
            <Users />
            <Text className="font-sans text-[14px] font-normal leading-container text-on-surface-variant">
              {room.memberCount} members
            </Text>
          </View>
        </Pressable>
      </View>
      {isModalOpen && (
        <CreateTripModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tripData={room}
        />
      )}

      {deleteModalOpen && (
        <DeleteTripModal
          trip={room}
          closeModal={() => setDeleteModalOpen(false)}
        />
      )}
    </ReanimatedSwipeable>
  );
};

export default TripRoomCard;
