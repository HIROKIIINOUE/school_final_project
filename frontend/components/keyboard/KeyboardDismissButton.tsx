import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  keyboardHeight: number;
  onPress: () => void;
};

const KeyboardDismissButton = (props: Props) => {
  const { keyboardHeight, onPress } = props;
  const insets = useSafeAreaInsets(); // get safe area to avoid hiding UI  

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Dismiss keyboard"
      onPress={onPress}
      className="absolute right-7 z-10 h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0F1C2F]/[0.96]"
      // when keyboard is shown, icon is located keyboard height + 10px from bottom, otherwise 28px from bottom
      style={{ bottom: Math.max(keyboardHeight + 10, insets.bottom + 28) }}
    >
      <MaterialCommunityIcons name="keyboard-close-outline" size={20} color="#E9EDF7" />
    </Pressable>
  );
}

export default KeyboardDismissButton
