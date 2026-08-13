import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SavedItineraryItem } from "../types/types";
import { fetchItineraries } from "../api/itinerary.api";
import { getDateKey } from "@/lib/formatDate";
import IndivisualItinerary from "../components/IndivisualItinerary";
import { Plus, SquarePen, Trash2 } from "lucide-react-native";
import { Link, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "@/components/Spinner";
import Toast from "react-native-toast-message";

type Props = { tripId: string };

const ItineraryClient = ({ tripId }: Props) => {
  const [itineraryItems, setItineraryItems] = useState<SavedItineraryItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // get the itineraries for this trip on load
  useFocusEffect(
    useCallback(() => {
      if (!tripId) return;
      let isActive = true;

      async function loadItineraries() {
        try {
          setIsLoading(true);

          const itineraries = await fetchItineraries(tripId);

          if (!isActive) {
            return;
          }

          setItineraryItems(itineraries);
        } catch {
          if (!isActive) {
            return;
          }

          Toast.show({
            type: "error",
            text1: "Failed to fetch your itinerary. Try again",
          });
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      void loadItineraries();

      return () => {
        isActive = false;
      };
    }, [tripId]),
  );

  // set Itineraries by date:
  // goal output : [ { "Aug 3": [itinerariItems] }, { "Aug 4": [itineraryItems] }... ]
  const dateMap = new Map();

  for (const item of itineraryItems) {
    const formattedDate = getDateKey(new Date(item.startTime));
    const currentItems = dateMap.get(formattedDate) ?? [];

    currentItems.push(item);
    dateMap.set(formattedDate, currentItems);
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner />
      </SafeAreaView>
    );
  }

  if (itineraryItems.length === 0) {
    return (
      <SafeAreaView className="empty-state" style={{ flex: 1 }}>
        <Text className="empty-title">No Itineraries created yet</Text>
        <Link
          href={{
            pathname: "/trips/[id]/create-itinerary",
            params: { id: tripId, mode: "create" },
          }}
          asChild
        >
          <Pressable className="btn-primary empty-action">
            <Text className="btn-primary-text">Create Itinerary here</Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    );
  }

  // display itineararies
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <View className="flex flex-row justify-between items-center px-md bg-surface">
        <View>
          <Text className="text-title text-primary">Itinerary Page</Text>
        </View>
        <View className="flex flex-row gap-sm items-center my-sm justify-end">
          <Link
            href={{
              pathname: "/trips/[id]/create-itinerary",
              params: { id: tripId, mode: "create" },
            }}
            asChild
          >
            <Pressable className="bg-primary-container h-11 w-11 rounded-full flex items-center justify-center mt-md">
              <Plus className="material-symbols-outlined" size={20} />
            </Pressable>
          </Link>
          <Link
            href={{
              pathname: "/trips/[id]/create-itinerary",
              params: { id: tripId, mode: "edit" },
            }}
            asChild
          >
            <Pressable className=" bg-secondary-container h-11 w-11 rounded-full flex items-center justify-center mt-md">
              <View className="flex flex-row gap-2">
                <SquarePen size={16} />
                {/* <Text>{isEditMode ? "Cancel" : "Edit"}</Text> */}
              </View>
            </Pressable>
          </Link>
        </View>
      </View>

      <ScrollView className="screen">
        {Array.from(dateMap.entries()).map(([key, value]) => (
          <View className="flex flex-row items-center" key={key}>
            <IndivisualItinerary date={key} itineraries={value} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItineraryClient;
