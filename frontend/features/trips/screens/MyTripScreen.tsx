import { View, Text, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";

import MytripHeader from "@/features/trips/components/MytripHeader";
import CreateTripModal from "@/features/trips/components/CreateTripModal";
import TripRoomCard from "@/features/trips/components/TripRoomCard";
import { MyRoomType } from "../types/types";
import { fetchMyRooms } from "../api/myRoom.api";
import Spinner from "@/components/Spinner";
import { useAuthStore } from "@/store/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import JoinTripModal from "../components/JoinTripModal";
import { useQuery } from "@tanstack/react-query";

const MyTripScreen = () => {
  // const [tripRooms, setTripRooms] = useState<MyRoomType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const [isJoinTripModalOpen, setIsJoinTripModalOpen] =
    useState<boolean>(false);

  const authStatus = useAuthStore((state) => state.authStatus);
  const profileStatus = useAuthStore((state) => state.profileStatus);

  const isReady = authStatus === "authenticated" && profileStatus === "exists";

  const {
    data: tripRooms = [],
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["myTrips"],
    queryFn: fetchMyRooms,
    enabled: isReady,
  });

  // useEffect(() => {
  //   console.log("[MyTripScreen] readiness changed", {
  //     authStatus,
  //     profileStatus,
  //     isReady,
  //   });

  //   if (!isReady) {
  //     console.log("[MyTripScreen] trip fetch skipped; auth is not ready");
  //     return;
  //   }

  //   async function fetchAndSetTrips() {
  //     try {
  //       console.log("[MyTripScreen] trip fetch started");
  //       setIsLoading(true);
  //       const trips = await fetchMyRooms();
  //       console.log("[MyTripScreen] trip fetch succeeded", {
  //         tripCount: trips.length,
  //       });
  //       setTripRooms(trips);
  //     } catch (e) {
  //       // toast message
  //       console.error(
  //         "Error occured: ",
  //         e instanceof Error ? e.message : "Failed to fetch trips",
  //       );
  //     } finally {
  //       setIsLoading(false);
  //       console.log("[MyTripScreen] trip fetch finished");
  //     }
  //   }

  //   fetchAndSetTrips();
  // }, [isReady]);

  if (isLoading || !isReady) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>
          {error instanceof Error ? error.message : "Failed to fetch trips"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1">
      {isCreateModalOpen && (
        <CreateTripModal
          visible={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          tripData={null}
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
        <Pressable
          className="btn-secondary my-lg mx-md flex-1"
          onPress={() => setIsJoinTripModalOpen(true)}
        >
          <Text>Join Trip</Text>
        </Pressable>
      </View>

      {tripRooms.length === 0 ? (
        // TODO: add styling
        <View className="empty-state">
          <Text className="empty-title">No room yet</Text>
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

      {isJoinTripModalOpen && (
        <JoinTripModal closeModal={() => setIsJoinTripModalOpen(false)} />
      )}
    </SafeAreaView>
  );
};

export default MyTripScreen;
