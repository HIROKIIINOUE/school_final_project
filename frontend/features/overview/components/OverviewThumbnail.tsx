import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

const OverviewThumbnail = () => {
  return (
    <View className="relative w-full h-64 md:h-80">
      <Image
        source={require("../../../assets/images/fun-travel.png")}
        className="w-full h-full object-cover"
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <Link href="/(protected)" asChild>
        <Pressable className="absolute left-sm top-sm h-15 w-15 items-center justify-center rounded-full bg-white/50">
          <ChevronLeft size={32} />
        </Pressable>
      </Link>
    </View>
  );
};

export default OverviewThumbnail;
