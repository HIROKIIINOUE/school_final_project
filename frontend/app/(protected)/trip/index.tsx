import { View, Text, Pressable } from "react-native";
import React from "react";

import { mockTripRooms } from "@/features/trips/data/dummyRoomData";

const index = () => {
  return mockTripRooms.map((room) => (
    <Pressable key={room.id} className="card">
      <Text className="card-title">{room.title}</Text>
      <Text className="card-subtitle">{room.memberCount}</Text>
    </Pressable>
  ));
};

export default index;
