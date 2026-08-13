import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchExpenses,
  fetchExpenseTripData,
} from "../api/expense.api";
import { Expense, ExpenseTripData } from "../types/expense.type";
import { calculateSettlements } from "../utils/calculateSettlements";

type Props = {
  tripId: string;
};

const formatCurrency = (amount: number) =>
  `$ ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const getMemberName = (displayName: string | undefined) =>
  displayName ?? "Unknown member";

type MemberAvatarProps = {
  displayName: string;
  image: string | null | undefined;
  variant: "payer" | "receiver";
};

const MemberAvatar = ({ displayName, image, variant }: MemberAvatarProps) => {
  const backgroundColor = variant === "payer" ? "#e57d8c" : "#238688";

  if (image) {
    return (
      <Image
        accessibilityLabel={`${displayName}'s avatar`}
        className="h-12 w-12 rounded-full border-2 border-white"
        source={{ uri: image }}
      />
    );
  }

  return (
    <View
      accessibilityLabel={`${displayName}'s avatar`}
      className="h-12 w-12 items-center justify-center rounded-full border-2 border-white"
      style={{ backgroundColor }}
    >
      <Text className="text-lg font-extrabold text-white">
        {displayName.trim().charAt(0).toUpperCase() || "?"}
      </Text>
    </View>
  );
};

const SummaryScreen = ({ tripId }: Props) => {
  const router = useRouter();
  const [tripData, setTripData] = useState<ExpenseTripData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummaryData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [fetchedTripData, fetchedExpenses] = await Promise.all([
        fetchExpenseTripData(tripId),
        fetchExpenses(tripId),
      ]);
      setTripData(fetchedTripData);
      setExpenses(fetchedExpenses);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load payment summary.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadSummaryData();
  }, [loadSummaryData]);

  const settlements = useMemo(
    () => calculateSettlements(expenses, tripData?.members ?? []),
    [expenses, tripData?.members],
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#f7f8ff]">
        <ActivityIndicator color="#238688" />
      </SafeAreaView>
    );
  }

  if (error || !tripData) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-[#f7f8ff] px-6">
        <Text className="text-center text-[#e44257]">
          {error ?? "Payment summary could not be loaded."}
        </Text>
        <Pressable
          className="rounded-xl bg-[#238688] px-4 py-3"
          onPress={loadSummaryData}
        >
          <Text className="font-bold text-white">Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f8ff" }} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Payment Summary", headerShown: true }} />
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={settlements}
          keyExtractor={(settlement, index) =>
            `${settlement.from.id}-${settlement.to.id}-${index}`
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 }}
          ListHeaderComponent={
            <View className="mb-4">
              <Text className="text-xl font-bold text-[#278184]">
                {tripData.trip.title}
              </Text>
              <Text className="mt-1 text-sm text-[#647184]">
                Expense payment summary
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="items-center rounded-2xl border border-[#b9d7db] bg-[#f4ffff] px-5 py-8">
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={42}
                color="#238688"
              />
              <Text className="mt-3 text-lg font-bold text-[#263342]">
                All settled up
              </Text>
              <Text className="mt-1 text-center text-sm text-[#647184]">
                No payments are needed right now.
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item: settlement }) => (
            <View className="flex-row items-center rounded-xl border border-[#d2d9e2] bg-white px-3 py-2.5">


              <View className="min-w-0 flex-1 flex-row items-center">
                <MemberAvatar
                  displayName={getMemberName(settlement.from.profile?.displayName)}
                  image={settlement.from.profile?.image}
                  variant="payer"
                />
                <View className="ml-1.5 flex-1">
                  <Text className="text-sm font-bold text-[#263342]" numberOfLines={1}>
                    {getMemberName(settlement.from.profile?.displayName)}
                  </Text>
                  <Text className="text-[10px] font-semibold text-[#e44257]">
                    Pays
                  </Text>
                </View>
                <View className="flex-col items-center">
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={16}
                    color="#238688"
                  />
                  <Text className="mr-3 text-lg font-extrabold text-[#238688]">
                    {formatCurrency(settlement.amount)}
                  </Text>

                </View>
                <View className="mx-1.5 flex-1 items-end">
                  <Text className="text-right text-sm font-bold text-[#263342]" numberOfLines={1}>
                    {getMemberName(settlement.to.profile?.displayName)}
                  </Text>
                  <Text className="text-[10px] font-semibold text-[#238688]">
                    Receives
                  </Text>
                </View>
                <MemberAvatar
                  displayName={getMemberName(settlement.to.profile?.displayName)}
                  image={settlement.to.profile?.image}
                  variant="receiver"
                />
              </View>
            </View>
          )}
        />
      </View>

      <View className="bg-[#f7f8ff] px-5 py-4">
        <Pressable
          className="h-12 items-center justify-center rounded-xl border border-[#cbd5e1]"
          onPress={() => router.replace(`/trips/${tripId}/expense`)}
        >
          <Text className="text-base font-bold text-[#647184]">Back to expenses</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SummaryScreen;
