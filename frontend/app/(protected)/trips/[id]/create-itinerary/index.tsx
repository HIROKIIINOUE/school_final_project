import CreateItineraryPage from "@/features/itinerary/screens/CreateOrEditItineraryPage";
import { Stack, useLocalSearchParams } from "expo-router";

export default function CreateItineraryRoute() {
  const { id, mode } = useLocalSearchParams<{
    id: string;
    mode: "edit" | "create";
  }>();

  return (
    <>
      <Stack.Screen options={{ title: "Create Itinerary" }} />

      <CreateItineraryPage tripId={id} mode={mode} />
    </>
  );
}
