import { Controller, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MemberAvatars from "@/components/MemberAvatars";
import KeyboardDismissButton from "@/components/keyboard/KeyboardDismissButton";
import { useKeyboard } from "@/components/keyboard/useKeyboard";
import { useAppZodForm } from "@/hooks/useAppZodForm";
import { expenseSchema } from "../schemas/expenseSchema";
import {
  CreateExpenseInput,
  Expense,
  ExpenseProfile,
  ExpenseTripMember,
} from "../types/expense.type";

type Props = {
  visible: boolean;
  members: ExpenseTripMember[];
  onClose: () => void;
  onCreate: (input: CreateExpenseInput) => Promise<void>;
  expense?: Expense | null;
  mode?: "add" | "update";
};

type ExpenseFormValues = z.infer<typeof expenseSchema>;

const getInitialFormValues = (
  expense: Expense | null,
  members: ExpenseTripMember[],
) => ({
  title: expense?.title ?? "",
  price: expense?.price,
  paidByMemberId: expense?.paidByMember.id ?? members[0]?.id ?? "",
  oweMemberIds: expense
    ? expense.splits.map((split) => split.tripMember.id)
    : members[0]
      ? [members[0].id]
      : [],
  splitType: expense?.splitType ?? "EQUAL",
  customSplits: expense
    ? Object.fromEntries(
        expense.splits.map((split) => [
          split.tripMember.id,
          split.owedAmount,
        ]),
      )
    : {},
  note: expense?.note ?? "",
});

const getCustomSplitInputs = (expense: Expense | null) =>
  expense
    ? Object.fromEntries(
        expense.splits.map((split) => [
          split.tripMember.id,
          String(split.owedAmount),
        ]),
      )
    : {};

const createEqualSplits = (price: number, memberIds: string[]) => {
  const totalInCents = Math.round(price * 100);
  const baseAmount = Math.floor(totalInCents / memberIds.length);
  const remainder = totalInCents % memberIds.length;

  return memberIds.map((tripMemberId, index) => ({
    tripMemberId,
    owedAmount: (baseAmount + (index < remainder ? 1 : 0)) / 100,
  }));
};

const AddExpenseModal = ({
  visible,
  members,
  onClose,
  onCreate,
  expense = null,
  mode = "add",
}: Props) => {
  const insets = useSafeAreaInsets();
  const [customSplitInputs, setCustomSplitInputs] = useState<Record<string, string>>(
    () => getCustomSplitInputs(expense),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { keyboardVisible, keyboardHeight, dismissKeyboard } = useKeyboard();
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useAppZodForm({
    schema: expenseSchema,
    defaultValues: getInitialFormValues(expense, members),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (mode === "update" || !visible || members.length === 0) return;

    reset(getInitialFormValues(null, members));
    setCustomSplitInputs({});
    setSubmitError(null);
  }, [members, mode, reset, visible]);

  const paidByMemberId = useWatch({ control, name: "paidByMemberId" });
  const selectedMemberIds = useWatch({ control, name: "oweMemberIds" }) ?? [];
  const splitType = useWatch({ control, name: "splitType" });
  const customSplits = useWatch({ control, name: "customSplits" });

  const selectedMembers = members
    .filter((member) => selectedMemberIds.includes(member.id))
    .map((member) => member.profile)
    .filter((profile): profile is ExpenseProfile => profile !== null);

  const toggleMember = (tripMemberId: string) => {
    const nextMemberIds = selectedMemberIds.includes(tripMemberId)
      ? selectedMemberIds.filter((memberId) => memberId !== tripMemberId)
      : [...selectedMemberIds, tripMemberId];
    const currentSplits = getValues("customSplits");

    setValue("oweMemberIds", nextMemberIds, { shouldValidate: true });
    setValue(
      "customSplits",
      Object.fromEntries(
        nextMemberIds.map((memberId) => [memberId, currentSplits[memberId] ?? 0]),
      ),
      { shouldValidate: splitType === "CUSTOM" },
    );
    setCustomSplitInputs((currentInputs) =>
      Object.fromEntries(
        nextMemberIds.map((memberId) => [memberId, currentInputs[memberId] ?? ""]),
      ),
    );
  };

  const updateCustomSplit = (tripMemberId: string, inputValue: string) => {
    setCustomSplitInputs((currentInputs) => ({ ...currentInputs, [tripMemberId]: inputValue }));
    setValue(
      "customSplits",
      { ...getValues("customSplits"), [tripMemberId]: inputValue === "" ? 0 : Number(inputValue) },
      { shouldValidate: true },
    );
  };

  const customTotal = selectedMemberIds.reduce(
    (total, memberId) => total + Number(customSplits?.[memberId] ?? 0),
    0,
  );
  const customSplitsError = errors.customSplits;
  const customSplitsErrorMessage =
    customSplitsError && "message" in customSplitsError && typeof customSplitsError.message === "string"
      ? customSplitsError.message
      : null;

  const handleClose = () => {
    reset();
    setCustomSplitInputs({});
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (values: ExpenseFormValues) => {
    const splits = values.splitType === "EQUAL"
      ? createEqualSplits(values.price, values.oweMemberIds)
      : values.oweMemberIds.map((tripMemberId) => ({
          tripMemberId,
          owedAmount: Number(values.customSplits[tripMemberId] ?? 0),
        }));

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onCreate({
        title: values.title,
        price: values.price,
        paidByMemberId: values.paidByMemberId,
        splitType: values.splitType,
        note: values.note || undefined,
        splits,
      });
      handleClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Failed to ${mode === "update" ? "update" : "register"} expense.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-end bg-black/40">
        <Pressable accessibilityLabel="Close add expense modal" className="absolute inset-0" onPress={handleClose} />
        <View className="h-[90%] rounded-t-[28px] bg-white px-5 pt-3">
          <View className="h-1 w-10 self-center rounded-full bg-[#cbd5e1]" />
          <Text className="mt-4 text-xl font-bold text-[#263342]">
            {mode === "update" ? "Update expense" : "Add expense"}
          </Text>
          <ScrollView className="flex-1" contentContainerClassName="gap-3 py-4" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {members.length === 0 ? <Text className="text-sm text-red-500">No trip members are available.</Text> : null}
            <View>
              <Text className="mb-1 text-sm font-semibold text-[#445160]">Title</Text>
              <Controller control={control} name="title" render={({ field: { onBlur, onChange, value } }) => (
                <TextInput className="h-11 rounded-xl border border-[#d5dde7] px-3 text-base text-[#263342]" placeholder="e.g. Team dinner" placeholderTextColor="#94a3b8" value={value} onBlur={onBlur} onChangeText={onChange} />
              )} />
              {errors.title?.message ? <Text className="mt-1 text-xs text-red-500">{errors.title.message}</Text> : null}
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#445160]">Paid by</Text>
              <View className="flex-row flex-wrap gap-2">
                {members.map((member) => {
                  const isSelected = paidByMemberId === member.id;
                  return <Pressable key={member.id} className="rounded-full border px-3 py-2" style={{ backgroundColor: isSelected ? "#dff2f3" : "#ffffff", borderColor: isSelected ? "#238688" : "#d5dde7" }} onPress={() => setValue("paidByMemberId", member.id, { shouldValidate: true })}>
                    <Text className="text-sm font-semibold" style={{ color: isSelected ? "#176a6d" : "#647184" }}>{member.profile?.displayName ?? "Unknown member"}</Text>
                  </Pressable>;
                })}
              </View>
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#445160]">How much</Text>
              <Controller control={control} name="price" render={({ field: { onBlur, onChange, value } }) => (
                <TextInput className="h-11 w-full rounded-xl border border-[#d5dde7] px-3 text-base text-[#263342]" keyboardType="decimal-pad" placeholder="0" placeholderTextColor="#94a3b8" value={value === undefined ? "" : String(value)} onBlur={onBlur} onChangeText={onChange} />
              )} />
              {errors.price?.message ? <Text className="mt-1 text-xs text-red-500">{errors.price.message}</Text> : null}
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#445160]">Split with</Text>
              <View className="flex-row flex-wrap gap-2">
                {members.map((member) => {
                  const isSelected = selectedMemberIds.includes(member.id);
                  return <Pressable key={member.id} className="rounded-full border px-3 py-2" style={{ backgroundColor: isSelected ? "#dff2f3" : "#ffffff", borderColor: isSelected ? "#238688" : "#d5dde7" }} onPress={() => toggleMember(member.id)}>
                    <Text className="text-sm font-semibold" style={{ color: isSelected ? "#176a6d" : "#647184" }}>{member.profile?.displayName ?? "Unknown member"}</Text>
                  </Pressable>;
                })}
              </View>
              {selectedMembers.length > 0 ? <View className="mt-3 flex-row items-center gap-2"><Text className="text-xs text-[#647184]">Selected</Text><MemberAvatars members={selectedMembers} maxDisplay={10} /></View> : null}
              {errors.oweMemberIds?.message ? <Text className="mt-1 text-xs text-red-500">{errors.oweMemberIds.message}</Text> : null}
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#445160]">How to split</Text>
              <View className="flex-row gap-2">
                {[{ label: "Equal split", value: "EQUAL" as const }, { label: "Custom", value: "CUSTOM" as const }].map((option) => {
                  const isSelected = splitType === option.value;
                  return <Pressable key={option.value} className="flex-1 items-center rounded-xl border px-3 py-3" style={{ backgroundColor: isSelected ? "#dff2f3" : "#ffffff", borderColor: isSelected ? "#238688" : "#d5dde7" }} onPress={() => setValue("splitType", option.value, { shouldValidate: true })}>
                    <Text className="text-sm font-bold" style={{ color: isSelected ? "#176a6d" : "#647184" }}>{option.label}</Text>
                  </Pressable>;
                })}
              </View>
              {splitType === "CUSTOM" ? <View className="mt-3 gap-2 rounded-xl bg-[#f7fafc] p-3">
                {members.filter((member) => selectedMemberIds.includes(member.id)).map((member) => <View key={member.id} className="flex-row items-center gap-3"><Text className="flex-1 text-sm font-semibold text-[#445160]">{member.profile?.displayName ?? "Unknown member"}</Text><TextInput keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor="#94a3b8" style={{ height: 40, width: 112, borderWidth: 1, borderColor: "#d5dde7", borderRadius: 8, backgroundColor: "#ffffff", paddingHorizontal: 12, color: "#263342", fontSize: 16, textAlign: "right" }} value={customSplitInputs[member.id] ?? ""} onChangeText={(value) => updateCustomSplit(member.id, value)} /></View>)}
                <View className="mt-1 flex-row justify-between border-t border-[#dce5ed] pt-2"><Text className="text-xs font-semibold text-[#647184]">Custom total</Text><Text className="text-xs font-bold text-[#263342]">{customTotal.toFixed(2)}</Text></View>
                {customSplitsErrorMessage ? <Text className="text-xs text-red-500">{customSplitsErrorMessage}</Text> : null}
              </View> : null}
            </View>
            <View>
              <Text className="mb-1 text-sm font-semibold text-[#445160]">Details (optional)</Text>
              <Controller control={control} name="note" render={({ field: { onBlur, onChange, value } }) => <TextInput className="min-h-[72px] rounded-xl border border-[#d5dde7] px-3 py-2 text-base text-[#263342]" multiline placeholder="Add an optional note" placeholderTextColor="#94a3b8" textAlignVertical="top" value={value ?? ""} onBlur={onBlur} onChangeText={onChange} />} />
            </View>
            {submitError ? <Text className="text-sm text-red-500">{submitError}</Text> : null}
            <View className="flex-row gap-3 border-t border-[#edf0f4] pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
              <Pressable className="h-12 flex-1 items-center justify-center rounded-xl border border-[#cbd5e1] active:opacity-60" onPress={handleClose}><Text className="text-base font-bold text-[#647184]">Close</Text></Pressable>
              <Pressable disabled={isSubmitting || members.length === 0} className="h-12 flex-1 items-center justify-center rounded-xl bg-[#238688] active:opacity-80" onPress={handleSubmit(onSubmit)}><Text className="text-base font-bold text-white">{isSubmitting ? (mode === "update" ? "Updating..." : "Registering...") : (mode === "update" ? "Update" : "Register")}</Text></Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      {keyboardVisible ? <KeyboardDismissButton keyboardHeight={keyboardHeight} onPress={dismissKeyboard} /> : null}
    </Modal>
  );
};

export default AddExpenseModal;
