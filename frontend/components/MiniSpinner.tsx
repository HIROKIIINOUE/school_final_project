import { ActivityIndicator } from "react-native";

type MiniSpinnerProps = {
  color?: string;
  accessibilityLabel?: string;
};

export default function MiniSpinner({
  color = "#006a6a",
  accessibilityLabel = "Loading",
}: MiniSpinnerProps) {
  return (
    <ActivityIndicator
      size="small"
      color={color}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
