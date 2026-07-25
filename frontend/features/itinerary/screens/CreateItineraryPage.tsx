import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { ItineraryInput } from "../types/types";
import ItineraryCardItem from "../components/ItineraryCardItem";
import CreateItineraryModal from "../components/CreateItineraryModal";
import { createItineraries } from "../api/itinerary.api";
import { ArrowLeft, Plus } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

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
      router.navigate(`/(protected)/trips/${tripId}/(tabs)/itinerary`);
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to add itinerary" });
    } finally {
      setIsSubmitting(false);
    }
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
          You haven't created items yet
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
          />
        )}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }} className="mx-sm mt-md">
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
        <Text>{isSubmitting ? "Submitting your data..." : "Submit"}</Text>
      </Pressable>

      {isModalOpen && (
        <CreateItineraryModal
          addItems={addToItems}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default CreateItineraryPage;
