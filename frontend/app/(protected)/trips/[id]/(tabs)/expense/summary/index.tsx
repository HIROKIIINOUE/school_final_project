import SummaryScreen from "@/features/expense/screens/SummaryScreen";
import { useGlobalSearchParams } from "expo-router";
import { Text } from "react-native";

const SummaryPage = () => {
  const { id } = useGlobalSearchParams();
  const tripId = Array.isArray(id) ? id[0] : id;

  if (!tripId) return <Text>Invalid trip route.</Text>;

  return <SummaryScreen tripId={tripId} />;
};

export default SummaryPage;
