import { View, Text } from "react-native";
import React from "react";
import { useGlobalSearchParams } from "expo-router";

const index = () => {
  const { id } = useGlobalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;
  console.log(tripId);
  if (!tripId) {
    return <Text>Invalid trip route.</Text>;
  }

  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;
