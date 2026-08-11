import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import MemberAvatars from "@/components/MemberAvatars";
import { useState } from "react";
import { Expense, ExpenseProfile } from "../types/expense.type";

type Props = {
  expense: Expense | null;
  visible: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!expense) return null;

  const splitProfiles = expense.splits
    .map((split) => split.tripMember.profile)
    .filter((profile): profile is ExpenseProfile => profile !== null);
  const paidBy = expense.paidByMember.profile?.displayName ?? "Unknown member";

  const handleDelete = () => {
    Alert.alert(
      "Delete expense?",
      "This expense and all of its splits will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            setDeleteError(null);

            try {
              await onDelete();
              onClose();
            } catch (error) {
              setDeleteError(
                error instanceof Error ? error.message : "Failed to delete expense.",
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        if (!isDeleting) onClose();
      }}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable
          accessibilityLabel="Close expense details"
          className="absolute inset-0"
          onPress={onClose}
          disabled={isDeleting}
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
                  {splitProfiles.length} member{splitProfiles.length === 1 ? "" : "s"}
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
                disabled={isDeleting}
                className={`h-12 flex-1 items-center justify-center rounded-xl ${
                  isDeleting ? "bg-[#e2e8f0]" : "border border-[#cbd5e1]"
                }`}
                onPress={onEdit}
              >
                <Text className={`text-base font-bold ${
                  isDeleting ? "text-[#94a3b8]" : "text-[#647184]"
                }`}>
                  Edit
                </Text>
              </Pressable>
              <Pressable
                disabled={isDeleting}
                className={`h-12 flex-1 items-center justify-center rounded-xl ${
                  isDeleting ? "bg-[#fda4af]" : "bg-[#e44257]"
                }`}
                onPress={handleDelete}
              >
                <Text className="text-base font-bold text-white">
                  {isDeleting ? "Deleting..." : "Delete"}
                </Text>
              </Pressable>
            </View>

            {deleteError ? (
              <Text className="text-sm text-[#e44257]">{deleteError}</Text>
            ) : null}

            <Pressable
              disabled={isDeleting}
              className={`mb-4 h-12 items-center justify-center rounded-xl ${
                isDeleting ? "bg-[#94a3b8]" : "bg-[#238688]"
              }`}
              onPress={() => {
                if (!isDeleting) onClose();
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
