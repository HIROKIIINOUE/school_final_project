import { View, Text, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";

import MytripHeader from "@/features/trips/components/MytripHeader";
import CreateTripModal from "@/features/trips/components/CreateTripModal";
import TripRoomCard from "@/features/trips/components/TripRoomCard";
import { MyRoomType } from "../types/types";
import { fetchMyRooms } from "../api/myRoom.api";
import Spinner from "@/components/Spinner";

const MyTripScreen = () => {
  const [tripRooms, setTripRooms] = useState<MyRoomType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAndSetTrips() {
      try {
        setIsLoading(true);
        console.log("Fetching trips");
        const trips = await fetchMyRooms();
        setTripRooms(trips);
      } catch (e) {
        // toast message
        console.error(
          "Error occured: ",
          e instanceof Error ? e.message : "Failed to fetch trips",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAndSetTrips();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

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

      {tripRooms.length === 0 ? (
        // TODO: add styling
        <View>
          <Text>No room yet</Text>
        </View>
      ) : (
        <FlatList
          data={tripRooms}
          keyExtractor={(room) => room.id}
          className="flex-1"
          contentContainerClassName="gap-md px-sm pb-xl"
          showsVerticalScrollIndicator={false}
          renderItem={({ item: room }) => <TripRoomCard room={room} />}
        />
      )}
    </View>
  );
};

export default MyTripScreen;
