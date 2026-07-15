import { View, Text } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";

const OverView = () => {
  const { id } = useLocalSearchParams();

  const [overviewData, setOverviewData] = useState();
  return (
    <View>
      <Text>OverView</Text>
    </View>
  );
};

export default OverView;
