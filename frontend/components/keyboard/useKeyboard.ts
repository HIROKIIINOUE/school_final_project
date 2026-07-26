import { useCallback, useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";

export const useKeyboard = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // display and hide keyboard-icon according to the status of keyboard
  useEffect(() => {
    const showEventName =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEventName =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    };

    const handleKeyboardHide = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showSubscription = Keyboard.addListener(
      showEventName,
      handleKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      hideEventName,
      handleKeyboardHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {
    keyboardVisible,
    keyboardHeight,
    dismissKeyboard,
  };
};
