import { View, Text, Pressable, FlatList } from "react-native";
import React, { useState } from "react";

import { mockTripRooms } from "@/features/trips/data/dummyRoomData";
import MytripHeader from "@/features/trips/components/MytripHeader";
import CreateTripModal from "@/features/trips/CreateTripModal";
import TripRoomCard from "@/features/trips/components/TripRoomCard";

const MyTripScreen = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  return (
    <View className="flex-1">
      {isCreateModalOpen && (
        <CreateTripModal
          visible={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
      <MytripHeader />
      <View className="flex flex-row items-center justify-center w-full">
        <Pressable
          className="btn-primary my-lg mx-md flex-1"
          onPress={() => setIsCreateModalOpen(true)}
        >
          <Text>Create Trip</Text>
        </Pressable>
        <Pressable className="btn-secondary my-lg mx-md flex-1">
          <Text>Join Trip</Text>
        </Pressable>
      </View>

      <FlatList
        data={mockTripRooms}
        keyExtractor={(room) => room.id}
        className="flex-1"
        contentContainerClassName="gap-md px-sm pb-xl"
        showsVerticalScrollIndicator={false}
        renderItem={({ item: room }) => <TripRoomCard room={room} />}
      />
    </View>
  );
};

export default MyTripScreen;
