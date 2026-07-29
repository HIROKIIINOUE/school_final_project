import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  SaveItineraryItemInput,
  SavedItineraryItem,
  ItineraryDraftItem,
} from "../types/types";
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
import {
  draftToSaveInput,
  savedItemToDraft,
} from "@/features/itinerary/lib/conversion";
import ItineraryDraftCardItem from "../components/ItineraryDraftItem";

type Props = { tripId: string; mode: "edit" | "create" };

const CreateItineraryPage = ({ tripId, mode }: Props) => {
  const [createdItems, setCreatedItems] = useState<ItineraryDraftItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItineraryDraftItem | null>(
    null,
  );

  const router = useRouter();

  function addToItems(input: ItineraryDraftItem) {
    // if already exists, update, else, push
    setCreatedItems((prev) => {
      const alreadyExists = prev.some(
        (item) => (item.id ?? item.clientId) === (input.id ?? input.clientId),
      );
      if (!alreadyExists) {
        return [...prev, input];
      }

      return prev.map((item) => {
        const currentId = item.id ?? item.clientId;

        // if current mapping item id is equal to newly input id, return newly input
        if (currentId === (input.id ?? input.clientId)) {
          return input;
        }
        return item;
      });
    });

    setSelectedItem(null);
    setIsModalOpen(false);
  }

  async function onSubmit() {
    const sendData = createdItems.map(draftToSaveInput);
    try {
      setIsSubmitting(true);
      const res =
        mode === "edit"
          ? await updateItineraries({ tripId, itineraries: sendData })
          : await createItineraries({ tripId, itineraryInputs: sendData });

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
    let isActive = true;

    if (mode === "create") {
      setCreatedItems([]);
      setIsLoading(false);

      return () => {
        isActive = false;
      };
    }

    async function loadEditableItinerary() {
      try {
        setIsLoading(true);

        const savedItems = await fetchItineraries(tripId);

        if (!isActive) {
          return;
        }

        const drafts = savedItems.map(savedItemToDraft);

        setCreatedItems(drafts);
      } catch {
        if (!isActive) {
          return;
        }

        Toast.show({ type: "error", text1: "Failed to fetch your data" });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadEditableItinerary();

    return () => {
      isActive = false;
    };
  }, [tripId, mode]);

  function onEditPress(id: string) {
    const targetItem = createdItems.find(
      (item) => (item.id ?? item.clientId) === id,
    );
    if (!targetItem) return;
    setSelectedItem(targetItem);
    setIsModalOpen(true);
  }

  function onDeletePress(id: string) {
    setCreatedItems((prev) =>
      prev.filter((item) => (item.id ?? item.clientId) !== id),
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner />
      </SafeAreaView>
    );
  }
  if (mode === "create" && createdItems.length === 0) {
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

  if (mode === "edit" && createdItems.length === 0) {
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
        <Pressable
          className="btn-primary m-md"
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          <Text>{isSubmitting ? "Submitting your data..." : "Submit"}</Text>
        </Pressable>
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
          <ItineraryDraftCardItem
            key={item.id ?? item.clientId}
            itineraryItem={item}
            onEditPress={onEditPress}
            onDeletePress={onDeletePress}
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
