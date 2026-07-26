import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ItineraryInput } from "../types/types";
import ItineraryCardItem from "../components/ItineraryCardItem";
import CreateItineraryModal from "../components/CreateOrEditItineraryModal";
import {
  createItineraries,
  fetchItineraries,
  updateItineraries,
} from "../api/itinerary.api";
import { ArrowLeft, Plus } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "@/components/Spinner";

type Props = { tripId: string; mode: "edit" | "create" };

const CreateItineraryPage = ({ tripId, mode }: Props) => {
  const [createdItems, setCreatedItems] = useState<ItineraryInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItineraryInput | null>(null);

  const router = useRouter();

  function addToItems(item: ItineraryInput) {
    // if already exists, update, else, push
    if (item.id) {
      const foundIndex = createdItems.findIndex((item) => item.id === item.id);
      createdItems[foundIndex] = item;
      setCreatedItems((prev) => [...prev]);
      return;
    }

    setCreatedItems((prev) => [...prev, item]);
  }

  async function onSubmit() {
    try {
      setIsSubmitting(true);
      const res =
        mode === "edit"
          ? await updateItineraries({ tripId, itineraries: createdItems })
          : await createItineraries({ tripId, itineraryInputs: createdItems });

      console.log(res);
      Toast.show({ type: "success", text1: "Successfully created itinerary" });
      router.navigate(`/(protected)/trips/${tripId}/(tabs)/itinerary`);
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to add itinerary" });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (mode === "create") return;
    async function fillUpField() {
      try {
        setIsLoading(true);
        const data = await fetchItineraries(tripId);
        setCreatedItems(data);
      } catch (e) {
        Toast.show({ type: "error", text1: "Failed to fetch your data" });
      } finally {
        setIsLoading(false);
      }
    }

    fillUpField();
  }, []);

  function onEditPress(id: string) {
    const targetItem = createdItems.find((item) => item.id === id);
    if (!targetItem) return;
    setSelectedItem(targetItem);
    setIsModalOpen(true);
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner />
      </SafeAreaView>
    );
  }
  if (createdItems.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="m-md">
        <Link
          href={`/(protected)/trips/${tripId}/(tabs)/itinerary`}
          className=" ml-7"
        >
          <View className="flex flex-row items-center text-primary">
            <ArrowLeft className="" />
            <Text className="text-primary">Go back</Text>
          </View>
        </Link>
        <Text className="text-muted text-center mb-md">
          Tap here to add item
        </Text>
        <Pressable
          className="btn-primary mx-md"
          onPress={() => setIsModalOpen(true)}
          disabled={isModalOpen}
        >
          <Text>Create item</Text>
        </Pressable>
        {isModalOpen && (
          <CreateItineraryModal
            addItems={addToItems}
            closeModal={() => setIsModalOpen(false)}
            item={selectedItem}
          />
        )}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }} className="mx-sm mt-md">
      <View className="flex flex-row justify-between items-center">
        <Link
          href={`/(protected)/trips/${tripId}/(tabs)/itinerary`}
          className=" ml-7"
        >
          <View className="flex flex-row items-center text-primary">
            <ArrowLeft className="" />
            <Text className="text-primary">Go back</Text>
          </View>
        </Link>
        <Pressable
          className="bg-primary-container rounded-full w-15 h-15 flex items-center justify-center mb-md mx-md"
          onPress={() => setIsModalOpen(true)}
        >
          <Plus size={24} />
        </Pressable>
      </View>
      <ScrollView className="mx-sm">
        {createdItems.map((item) => (
          <ItineraryCardItem
            key={item.id}
            itineraryItem={item}
            isEditMode={mode === "edit"}
            onEditPress={onEditPress}
          />
        ))}
      </ScrollView>

      <Pressable
        className="btn-primary m-md"
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        <Text>{isSubmitting ? "Submitting your data..." : "Submit"}</Text>
      </Pressable>

      {isModalOpen && (
        <CreateItineraryModal
          addItems={addToItems}
          closeModal={() => setIsModalOpen(false)}
          item={selectedItem}
        />
      )}
    </SafeAreaView>
  );
};

export default CreateItineraryPage;
