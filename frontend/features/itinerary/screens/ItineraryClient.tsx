import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { ItineraryInput } from "../types/types";

const ItineraryClient = () => {
  const [passingItineraryItems, setPassingItineraryItems] = useState<
    ItineraryInput[]
  >([]);

  return (
    <ScrollView>
      <Text>ItineraryClient</Text>
    </ScrollView>
  );
};

export default ItineraryClient;
