import CreateItineraryPage from "@/features/itinerary/screens/CreateItineraryPage";
import { Stack, useLocalSearchParams } from "expo-router";

export default function CreateItineraryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: "Create Itinerary" }} />

      <CreateItineraryPage tripId={id} />
    </>
  );
}
