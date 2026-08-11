import CreateItineraryPage from "@/features/itinerary/screens/CreateOrEditItineraryPage";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateItineraryRoute() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    mode?: string | string[];
  }>();

  const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const mode = rawMode === "create" || rawMode === "edit" ? rawMode : undefined;

  if (!tripId || !mode) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Invalid itinerary route.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Create Itinerary" }} />

      <CreateItineraryPage tripId={tripId} mode={mode} />
    </>
  );
}
