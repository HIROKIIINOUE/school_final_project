import { View, Text, Image, Pressable } from "react-native";
import React from "react";

const MytripHeader = () => {
  return (
    <View className="bg-surface dark:bg-surface-dim docked full-width top-0 border-b border-outline-variant dark:border-outline flat no shadows flex flex-row justify-between items-center w-full px-sm py-md sticky z-40">
      <View className="flex items-center flex-row gap-md">
        <View className="w-20 h-20 rounded-full overflow-hidden border border-outline-variant shrink-0">
          <Image
            alt="User profile avatar"
            className="w-full h-full object-cover"
            source={require("../../assets/images/example-avatar.jpg")}
          />
        </View>
        <Text className="headline-lg font-headline-lg font-bold text-primary dark:text-primary-fixed-dim">
          My Trips
        </Text>
      </View>
      <Pressable className="btn-primary">
        <Text className="material-symbols-outlined">settings</Text>
      </Pressable>
    </View>
  );
};

export default MytripHeader;
