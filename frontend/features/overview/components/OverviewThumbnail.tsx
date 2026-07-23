import { View, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";

const OverviewThumbnail = () => {
  return (
    <View className="relative w-full h-64 md:h-80">
      <Image
        source={require("../../../assets/images/fun-travel.png")}
        className="w-full h-full object-cover"
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
    </View>
  );
};

export default OverviewThumbnail;
