import ExpenseScreen from "@/features/expense/screens/ExpenseScreen";
import { useGlobalSearchParams } from "expo-router";
import { Text } from "react-native";

const index = () => {
  const { id } = useGlobalSearchParams();

  const tripId = Array.isArray(id) ? id[0] : id;

  if (!tripId) {
    return <Text>Invalid trip route.</Text>;
  }

  return <ExpenseScreen tripId={tripId} />;
};

export default index;
