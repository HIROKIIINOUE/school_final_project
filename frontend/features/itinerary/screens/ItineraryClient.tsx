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
  const [isEditMode, setIsEditMode] = useState(false);

  // get the itineraries for this trip on load
  useFocusEffect(
    useCallback(() => {
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
      <SafeAreaView className="m-sm" style={{ flex: 1 }}>
        <Text className="text-center text-xl text-muted">
          No Itineraries created yet
        </Text>
        <Link
          href={{
            pathname: "/trips/[id]/create-itinerary",
            params: { id: tripId, mode: "create" },
          }}
          asChild
        >
          <Pressable className="btn-primary mt-md">
            <Text className="text-on-primary">Create Itinerary here</Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    );
  }

  // display itineararies
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex flex-row justify-between items-center mx-md">
        <View>
          <Text className="text-title">View your itinerary</Text>
        </View>
        <View className="flex flex-row my-sm">
          <Link
            href={{
              pathname: "/trips/[id]/create-itinerary",
              params: { id: tripId, mode: "create" },
            }}
            asChild
          >
            <Pressable className="bg-primary-container h-15 w-15 rounded-full flex items-center justify-center mt-md mx-md">
              <Plus className="material-symbols-outlined" />
            </Pressable>
          </Link>
          <Link
            href={{
              pathname: "/trips/[id]/create-itinerary",
              params: { id: tripId, mode: "edit" },
            }}
            asChild
          >
            <Pressable className="flex-row items-center justify-center rounded-app-lg px-md py-sm bg-secondary-container active:opacity-80">
              <Text>{isEditMode ? "Cancel" : "Edit"}</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <ScrollView className="screen">
        {Array.from(dateMap.entries()).map(([key, value]) => (
          <View className="flex flex-row items-center" key={key}>
            <IndivisualItinerary
              date={key}
              itineraries={value}
              isEditMode={isEditMode}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItineraryClient;
