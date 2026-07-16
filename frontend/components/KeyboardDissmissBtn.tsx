import { Pressable, Keyboard } from "react-native";
import React from "react";
import { Keyboard as KeyboardIcon } from "lucide-react-native";

const KeyboardDissmissBtn = () => {
  return (
    <Pressable onPress={Keyboard.dismiss}>
      <KeyboardIcon />
    </Pressable>
  );
};

export default KeyboardDissmissBtn;
