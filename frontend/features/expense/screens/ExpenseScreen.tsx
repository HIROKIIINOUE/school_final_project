import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MemberAvatars from "@/components/MemberAvatars";
import AddExpenseModal from "@/features/expense/components/AddExpenseModal";
import { Profile } from "@/features/profile/types/profile.type";

const StyledSafeAreaView = styled(SafeAreaView);

// ダミーデータ。あとでデータベースのデータと差し替え
const createDummyMember = (
  id: number,
  displayName: string,
  image: string | null = null,
): Profile => ({
  id,
  userId: `member-${id}`,
  displayName,
  image,
  createdAt: "2026-07-26T00:00:00.000Z",
  updatedAt: "2026-07-26T00:00:00.000Z",
});

// ダミーデータ。あとでデータベースのデータと差し替え
const dummyExpenses = [
  {
    id: "team-dinner",
    title: "Team Dinner",
    price: 12000,
    paidBy: "Hiroki",
    detail: "",
    members: [
      createDummyMember(1, "Hiroki", "https://i.pravatar.cc/64?img=12"),
      createDummyMember(2, "Takaki"),
      createDummyMember(3, "Taisei"),
      createDummyMember(4, "Suzuna"),
      createDummyMember(5, "Yuki"),
      createDummyMember(6, "Mina"),
      createDummyMember(7, "Sora"),
      createDummyMember(8, "Riku"),
    ],
  },
  {
    id: "museum-entry",
    title: "Museum Entry",
    price: 4000,
    paidBy: "You",
    detail: "",
    members: [
      createDummyMember(9, "Aiko", "https://i.pravatar.cc/64?img=32"),
      createDummyMember(10, "Ren"),
      createDummyMember(11, "Mei"),
    ],
  },
];

const formatCurrency = (amount: number) => `$ ${amount.toLocaleString()}`;

const ExpenseScreen = () => {
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] =
    useState(false);

  return (
    <StyledSafeAreaView className="flex-1 bg-[#f7f8ff]" edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title: "Expense Calculate" }} />

      <FlatList
        className="flex-1 px-[14px] pb-6"
        data={dummyExpenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View className="mt-1 px-[14px] pt-4">
              <Text className="text-[20px] font-bold tracking-[-0.3px] text-[#278184]">
                Tokyo Summer Adventure
              </Text>
              <View className="mt-1 flex-row items-center gap-1">
                <MaterialCommunityIcons name="calendar-blank-outline" size={16} color="#596574" />
                <Text className="text-[16px] font-medium text-[#596574]">Aug 10 - Aug 20</Text>
              </View>
            </View>
            <View className="mt-3 h-px bg-[#dfe3eb]" />
            <View className="mt-[14px] rounded-[8px] border border-[#c9dce2] bg-[#f4ffff] px-4 py-[10px]">
              <Text className="text-center text-[12px] font-bold tracking-[1.2px] text-[#687383] capitalize">
                TOTAL TRIP COST
              </Text>
              <Text className="mt-1 text-center text-[28px] font-extrabold tracking-[-0.8px] text-[#273341]">
                {formatCurrency(142500)}
              </Text>
            </View>

            <View className="mt-[10px] flex-row gap-[10px]">
              <View className="flex-1 rounded-[8px] border border-[#f1cad0] bg-[#fff1f2] px-[10px] py-[10px]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[9px] font-bold tracking-[0.8px] text-[#7c6a70]">YOU OWE</Text>
                  <AntDesign name="arrow-up" size={12} color="#e44257" />
                </View>
                <Text className="mt-1 text-[15px] font-extrabold text-[#e44257]">¥4,500</Text>
              </View>
              <View className="flex-1 rounded-[8px] border border-[#b9d7db] bg-[#dff2f3] px-[10px] py-[10px]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[9px] font-bold tracking-[0.8px] text-[#587175]">ARE OWED</Text>
                  <AntDesign name="arrow-down" size={12} color="#238688" />
                </View>
                <Text className="mt-1 text-[15px] font-extrabold text-[#238688]">¥16,000</Text>
              </View>
            </View>

            <View className="mt-[32px] flex-col items-center">
              <Text className="text-[20px] font-extrabold text-[#2e3a48]">Recent Expenses</Text>
              <Pressable
                accessibilityRole="button"
                className="bg-[#238688] rounded flex-row items-center gap-1 p-2 my-4 active:opacity-60"
                onPress={() => setIsAddExpenseModalVisible(true)}
              >
                <AntDesign name="plus" size={16} color="white" />
                <Text className="text-[16px] font-bold text-white">Add expense</Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <View
            className={`flex-col items-center px-[10px] py-[10px] ${index === 0 ? "rounded-t-[8px] border border-b-0 border-[#d2d9e2] bg-white" : "rounded-b-[8px] border border-[#d2d9e2] bg-white"
              }`}
          >
            <View className="w-full ml-[10px] flex flex-row justify-between">
              <Text className="text-[16px] font-bold text-[#354150]">{item.title}</Text>
              <Text className="text-[16px] font-extrabold text-[#354150]">{formatCurrency(item.price)}</Text>
            </View>
            <View className="w-full ml-[10px] flex flex-row justify-between">
              <Text className="mt-[2px] text-[12px] text-[#647184]">
                Paid by <Text className="font-bold text-[#278184]">{item.paidBy}</Text>
              </Text>
              <View className="mt-[4px]">
                <MemberAvatars members={item.members} maxDisplay={5} />
              </View>
            </View>
          </View>
        )}
      />
      <AddExpenseModal
        visible={isAddExpenseModalVisible}
        onClose={() => setIsAddExpenseModalVisible(false)}
      />
    </StyledSafeAreaView>
  );
};

export default ExpenseScreen;
