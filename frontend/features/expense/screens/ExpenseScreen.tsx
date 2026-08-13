import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { styled } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MemberAvatars from "@/components/MemberAvatars";
import { useAuthStore } from "@/store/auth.store";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  fetchExpenseTripData,
  updateExpense,
} from "../api/expense.api";
import AddExpenseModal from "../components/AddExpenseModal";
import DetailExpenseModal from "../components/DetailExpenseModal";
import UpdateExpenseModal from "../components/UpdateExpenseModal";
import { useExpenseSummary } from "../hooks/useExpenseSummary";
import {
  CreateExpenseInput,
  Expense,
  ExpenseTripData,
} from "../types/expense.type";

type Props = { tripId: string };

const StyledSafeAreaView = styled(SafeAreaView);

const formatCurrency = (amount: number) =>
  `$ ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const formatDateRange = (startDate: string | null, endDate: string | null) => {
  if (!startDate || !endDate) return "Dates not set";
  const format = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${format.format(new Date(startDate))} - ${format.format(new Date(endDate))}`;
};

const ExpenseScreen = ({ tripId }: Props) => {
  // const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [expenseData, setExpenseData] = useState<ExpenseTripData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] =
    useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const loadExpenseData = useCallback(async () => {
    if (!tripId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [tripData, fetchedExpenses] = await Promise.all([
        fetchExpenseTripData(tripId),
        fetchExpenses(tripId),
      ]);
      setExpenseData(tripData);
      setExpenses(fetchedExpenses);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load expenses.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadExpenseData();
  }, [loadExpenseData]);

  const summary = useExpenseSummary(expenses, currentUserId);

  const handleCreateExpense = async (input: CreateExpenseInput) => {
    if (!tripId) throw new Error("Trip ID is missing");
    const createdExpense = await createExpense(tripId, input);
    setExpenses((currentExpenses) => [createdExpense, ...currentExpenses]);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!tripId) throw new Error("Trip ID is missing");
    await deleteExpense(tripId, expenseId);
    await loadExpenseData();
  };

  const handleUpdateExpense = async (
    expenseId: string,
    input: CreateExpenseInput,
  ) => {
    if (!tripId) throw new Error("Trip ID is missing");
    await updateExpense(tripId, expenseId, input);
    await loadExpenseData();
  };

  if (isLoading) {
    return (
      <StyledSafeAreaView className="flex-1 items-center justify-center bg-[#f7f8ff]">
        <ActivityIndicator color="#238688" />
      </StyledSafeAreaView>
    );
  }

  if (error || !expenseData) {
    return (
      <StyledSafeAreaView className="flex-1 items-center justify-center gap-4 bg-[#f7f8ff] px-6">
        <Text className="text-center text-[#e44257]">
          {error ?? "Trip data could not be loaded."}
        </Text>
        <Pressable
          className="rounded bg-[#238688] px-4 py-3"
          onPress={loadExpenseData}
        >
          <Text className="font-bold text-white">Try again</Text>
        </Pressable>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView
      className="flex-1 bg-[#f7f8ff]"
      edges={["top", "left", "right", "bottom"]}
    >
      <Stack.Screen options={{ title: "Expense Calculate" }} />
      <FlatList
        className="flex-1 px-[14px] pb-6"
        data={expenses}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={loadExpenseData}
        ItemSeparatorComponent={() => <View className="h-px bg-[#d2d9e2]" />}
        ListEmptyComponent={
          <Text className="mt-2 text-center text-sm text-[#647184]">
            No expenses yet.
          </Text>
        }
        ListFooterComponent={
          <View className="items-center py-6">
            <Pressable
              className="flex-row items-center gap-2 rounded-xl border border-[#b9d7db] bg-[#dff2f3] px-5 py-3"
              onPress={() => router.push(`/trips/${tripId}/expense/summary`)}
            >
              <MaterialCommunityIcons
                name="text-box-search-outline"
                size={20}
                color="#238688"
              />
              <Text className="text-base font-bold text-[#238688]">
                Summarize
              </Text>
            </Pressable>
          </View>
        }
        ListHeaderComponent={
          <>
            <View className="mt-1 px-[14px] pt-4">
              <Text className="text-[20px] font-bold tracking-[-0.3px] text-[#278184]">
                {expenseData.trip.title}
              </Text>
              <View className="mt-1 flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="calendar-blank-outline"
                  size={16}
                  color="#596574"
                />
                <Text className="text-[16px] font-medium text-[#596574]">
                  {formatDateRange(
                    expenseData.trip.startDate,
                    expenseData.trip.endDate,
                  )}
                </Text>
              </View>
            </View>

            <View className="mt-3 h-px bg-[#dfe3eb]" />

            <View className="mt-[14px] rounded-[8px] border border-[#c9dce2] bg-[#f4ffff] px-4 py-[10px]">
              <Text className="text-center text-[12px] font-bold tracking-[1.2px] text-[#687383] capitalize">
                TOTAL TRIP COST
              </Text>
              <Text className="mt-1 text-center text-[28px] font-extrabold tracking-[-0.8px] text-[#273341]">
                {formatCurrency(summary.totalTripCost)}
              </Text>
            </View>

            <View className="mt-[10px] flex-row gap-[10px]">
              <View className="flex-1 rounded-[8px] border border-[#f1cad0] bg-[#fff1f2] px-[10px] py-[10px]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[9px] font-bold tracking-[0.8px] text-[#7c6a70]">
                    YOU OWE
                  </Text>
                  <AntDesign name="arrow-up" size={12} color="#e44257" />
                </View>
                <Text className="mt-1 text-[15px] font-extrabold text-[#e44257]">
                  {formatCurrency(summary.youOwe)}
                </Text>
              </View>
              <View className="flex-1 rounded-[8px] border border-[#b9d7db] bg-[#dff2f3] px-[10px] py-[10px]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[9px] font-bold tracking-[0.8px] text-[#587175]">
                    ARE OWED
                  </Text>
                  <AntDesign name="arrow-down" size={12} color="#238688" />
                </View>
                <Text className="mt-1 text-[15px] font-extrabold text-[#238688]">
                  {formatCurrency(summary.areOwed)}
                </Text>
              </View>
            </View>

            <View className="mt-[32px] flex-col items-center">
              <Text className="text-[20px] font-extrabold text-[#2e3a48]">
                Recent Expenses
              </Text>
              <Pressable
                accessibilityRole="button"
                className="my-4 flex-row items-center gap-1 rounded bg-[#238688] p-2 active:opacity-60"
                onPress={() => setIsAddExpenseModalVisible(true)}
              >
                <AntDesign name="plus" size={16} color="white" />
                <Text className="text-[16px] font-bold text-white">
                  Add expense
                </Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          const splitProfiles = item.splits
            .map((split) => split.tripMember.profile)
            .filter(
              (profile): profile is NonNullable<typeof profile> =>
                profile !== null,
            );
          const paidBy =
            item.paidByMember.profile?.displayName ?? "Unknown member";
          const isFirst = index === 0;
          const isLast = index === expenses.length - 1;
          const cardClass =
            isFirst && isLast
              ? "rounded-[8px] border border-[#d2d9e2] bg-white"
              : isFirst
                ? "rounded-t-[8px] border-x border-t border-[#d2d9e2] bg-white"
                : isLast
                  ? "rounded-b-[8px] border-x border-b border-[#d2d9e2] bg-white"
                  : "border-x border-[#d2d9e2] bg-white";

          return (
            <Pressable
              className={`flex-col items-center px-[10px] py-[10px] ${cardClass}`}
              onPress={() => setSelectedExpense(item)}
            >
              <View className="ml-[10px] w-full flex-row justify-between">
                <Text className="text-[16px] font-bold text-[#354150]">
                  {item.title}
                </Text>
                <Text className="text-[16px] font-extrabold text-[#354150]">
                  {formatCurrency(item.price)}
                </Text>
              </View>
              <View className="ml-[10px] w-full flex-row justify-between">
                <Text className="mt-[2px] text-[12px] text-[#647184]">
                  Paid by{" "}
                  <Text className="font-bold text-[#278184]">{paidBy}</Text>
                </Text>
                <View className="mt-[4px]">
                  <MemberAvatars members={splitProfiles} maxDisplay={5} />
                </View>
              </View>
            </Pressable>
          );
        }}
      />
      <AddExpenseModal
        visible={isAddExpenseModalVisible}
        members={expenseData.members}
        onClose={() => setIsAddExpenseModalVisible(false)}
        onCreate={handleCreateExpense}
      />
      <DetailExpenseModal
        expense={selectedExpense}
        visible={selectedExpense !== null && editingExpense === null}
        onClose={() => setSelectedExpense(null)}
        onDelete={() => handleDeleteExpense(selectedExpense!.id)}
        onEdit={() => {
          setEditingExpense(selectedExpense);
          setSelectedExpense(null);
        }}
      />
      {editingExpense ? (
        <UpdateExpenseModal
          key={editingExpense.id}
          expense={editingExpense}
          visible
          members={expenseData.members}
          onClose={() => setEditingExpense(null)}
          onUpdate={(input) => handleUpdateExpense(editingExpense.id, input)}
        />
      ) : null}
    </StyledSafeAreaView>
  );
};

export default ExpenseScreen;
