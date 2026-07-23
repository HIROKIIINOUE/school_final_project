import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { ItineraryInput } from "../types/types";
import ItineraryCardItem from "../components/ItineraryCardItem";
import CreateItineraryModal from "../components/CreateItineraryModal";

const CreateItineraryPage = () => {
  const [createdItems, setCreatedItems] = useState<ItineraryInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function addToItems(item: ItineraryInput) {
    setCreatedItems((prev) => [...prev, item]);
  }

  if (createdItems.length === 0) {
    return (
      <View>
        <Text>You haven't created items yet</Text>
        <Pressable className="btn-primary">
          <Text>Create item</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View>
      {createdItems.map((item) => (
        <ItineraryCardItem itineraryItem={item} />
      ))}

      <Pressable className="btn-primary">
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
