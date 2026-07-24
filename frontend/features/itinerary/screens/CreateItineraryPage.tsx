import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { ItineraryInput } from "../types/types";
import ItineraryCardItem from "../components/ItineraryCardItem";
import CreateItineraryModal from "../components/CreateItineraryModal";
import { createItineraries } from "../api/itinerary.api";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

type Props = { tripId: string };

const CreateItineraryPage = ({ tripId }: Props) => {
  const [createdItems, setCreatedItems] = useState<ItineraryInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  function addToItems(item: ItineraryInput) {
    setCreatedItems((prev) => [...prev, item]);
  }

  async function onSubmit() {
    try {
      setIsSubmitting(true);
      const res = await createItineraries({
        tripId,
        itineraryInputs: createdItems,
      });

      console.log(res);
      Toast.show({ type: "success", text1: "Successfully created itinerary" });
      router.navigate(`/(protected)/trips/${tripId}/itinerary`);
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to add itinerary" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdItems.length === 0) {
    return (
      <View className="m-md">
        <Text className="text-muted text-center mb-md">
          You haven't created items yet
        </Text>
        <Pressable
          className="btn-primary"
          onPress={() => setIsModalOpen(true)}
          disabled={isModalOpen}
        >
          <Text>Create item</Text>
        </Pressable>
        {isModalOpen && (
          <CreateItineraryModal
            addItems={addToItems}
            closeModal={() => setIsModalOpen(false)}
          />
        )}
      </View>
    );
  }
  return (
    <View className="mx-sm mt-md">
      <Pressable
        className="bg-primary-container rounded-full w-15 h-15 flex items-center justify-center mb-md"
        onPress={() => setIsModalOpen(true)}
      >
        <Plus size={24} />
      </Pressable>
      {createdItems.map((item) => (
        <ItineraryCardItem key={item.title} itineraryItem={item} />
      ))}

      <Pressable
        className="btn-primary"
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        <Text>Submit itineraries</Text>
      </Pressable>

      {isModalOpen && (
        <CreateItineraryModal
          addItems={addToItems}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </View>
  );
};

export default CreateItineraryPage;
