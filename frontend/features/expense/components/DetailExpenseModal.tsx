import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import MemberAvatars from "@/components/MemberAvatars";
import { Expense, ExpenseProfile } from "../types/expense.type";

type Props = {
  expense: Expense | null;
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

const formatCurrency = (amount: number) =>
  `$ ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const DetailExpenseModal = ({
  expense,
  visible,
  onClose,
  onDelete,
  onEdit,
}: Props) => {
  if (!expense) return null;

  const splitProfiles = expense.splits
    .map((split) => split.tripMember.profile)
    .filter((profile): profile is ExpenseProfile => profile !== null);
  const paidBy = expense.paidByMember.profile?.displayName ?? "Unknown member";

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable
          accessibilityLabel="Close expense details"
          className="absolute inset-0"
          onPress={onClose}
        />

        <View className="h-[90%] rounded-t-[28px] bg-white px-5 pt-3 shadow-2xl">
          <View className="h-1 w-10 self-center rounded-full bg-[#cbd5e1]" />

          <ScrollView
            contentContainerClassName="gap-5 py-5"
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text className="text-xs font-bold uppercase tracking-[1px] text-[#647184]">
                Expense
              </Text>
              <Text className="mt-1 text-2xl font-bold text-[#263342]">
                {expense.title}
              </Text>
            </View>

            <View className="rounded-2xl bg-[#f4ffff] p-4">
              <Text className="text-sm text-[#647184]">Paid by {paidBy}</Text>
              <Text className="mt-1 text-3xl font-extrabold text-[#263342]">
                {formatCurrency(expense.price)}
              </Text>
            </View>

            <View>
              <Text className="text-sm font-semibold text-[#445160]">
                Split with
              </Text>
              <View className="mt-3 flex-row items-center gap-2">
                <MemberAvatars members={splitProfiles} maxDisplay={15} />
                <Text className="text-sm text-[#647184]">
                  {splitProfiles.length} member
                  {splitProfiles.length === 1 ? "" : "s"}
                </Text>
              </View>
            </View>

            {expense.note ? (
              <View className="rounded-xl border border-[#c9dce2] bg-[#f4ffff] p-4">
                <Text className="text-sm font-bold text-[#238688]">
                  Details
                </Text>
                <Text className="mt-2 text-base leading-6 text-[#445160]">
                  {expense.note}
                </Text>
              </View>
            ) : null}

            <View className="flex-row gap-3 border-t border-[#edf0f4] pt-4">
              <Pressable
                className={`h-12 flex-1 items-center justify-center rounded-xl ${"border border-[#cbd5e1]"}`}
                onPress={onEdit}
              >
                <Text className={`text-base font-bold ${"text-[#647184]"}`}>
                  Edit
                </Text>
              </Pressable>
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl bg-[#e44257]"
                onPress={onDelete}
              >
                <Text className="text-base font-bold text-white">Delete</Text>
              </Pressable>
            </View>

            <Pressable
              className={`mb-4 h-12 items-center justify-center rounded-xl ${"bg-[#238688]"}`}
              onPress={() => {
                onClose();
              }}
            >
              <Text className="text-base font-bold text-white">Close</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DetailExpenseModal;
