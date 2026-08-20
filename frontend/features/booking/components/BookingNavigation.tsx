import { Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function AddBookingButton({
  floating = false,
  onPress,
}: {
  floating?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel="Add booking"
      accessibilityRole="button"
      className={
        floating
          ? "absolute bottom-lg right-lg h-14 w-14 items-center justify-center rounded-app-full bg-primary-container shadow-lg md:hidden"
          : "btn-primary hidden gap-sm rounded-app-full px-lg md:flex"
      }
      onPress={onPress}
    >
      <Plus
        color={floating ? "#004444" : "#ffffff"}
        size={24}
        strokeWidth={2.5}
      />
      {!floating ? <Text className="btn-primary-text">Add Booking</Text> : null}
    </Pressable>
  );
}
