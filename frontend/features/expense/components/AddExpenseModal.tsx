import { Controller, useWatch } from "react-hook-form";
import { useState } from "react";
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
import { useAppZodForm } from "@/hooks/useAppZodForm";
import { dummyTripMembers } from "../data/dummyTripMembers";
import { expenseSchema } from "../schemas/expenseSchema";
import { useKeyboard } from "@/components/keyboard/useKeyboard";
import KeyboardDismissButton from "@/components/keyboard/KeyboardDismissButton";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AddExpenseModal = ({ visible, onClose }: Props) => {
  const insets = useSafeAreaInsets();
  // customSplitInputs type definition is <"string", "string"> to show the number properly in TextInput.
  // whereas customSplits type definition is <"number", "number"> to calculate, validate and save data.
  const [customSplitInputs, setCustomSplitInputs] = useState<Record<string, string>>({});
  const { keyboardVisible, keyboardHeight, dismissKeyboard } = useKeyboard()
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useAppZodForm({
    schema: expenseSchema,
    defaultValues: {
      title: "",
      paidByMemberId: dummyTripMembers[0].id,
      oweMemberIds: [dummyTripMembers[0].id],
      splitType: "EQUAL",
      customSplits: {},
      note: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const paidByMemberId = useWatch({ control, name: "paidByMemberId" });
  const selectedMemberIds = useWatch({ control, name: "oweMemberIds" }) ?? [];
  const splitType = useWatch({ control, name: "splitType" });
  const customSplits = useWatch({ control, name: "customSplits" });

  const selectedMembers = dummyTripMembers
    .filter((member) => selectedMemberIds.includes(member.id))
    .map((member) => member.profile);

  const toggleMember = (tripMemberId: string) => {
    // check if toggled member is "to add" or "to remove"
    const nextMemberIds = selectedMemberIds.includes(tripMemberId)
      ? selectedMemberIds.filter((memberId) => memberId !== tripMemberId)
      : [...selectedMemberIds, tripMemberId];
    const currentSplits = getValues("customSplits");

    setValue(
      "oweMemberIds",
      nextMemberIds,
      { shouldValidate: true },
    );
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
    setCustomSplitInputs((currentInputs) => ({
      ...currentInputs,
      [tripMemberId]: inputValue,
    }));
    setValue(
      "customSplits",
      {
        ...getValues("customSplits"),
        [tripMemberId]: inputValue === "" ? 0 : Number(inputValue),
      },
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
    onClose();
  };

  const onSubmit = () => {
    // ここにAPI送信処理を記載する
    handleClose();
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/40"
      >
        <Pressable
          accessibilityLabel="Close add expense modal"
          className="absolute inset-0"
          onPress={handleClose}
        />
        <View className="h-[85%] rounded-t-[28px] bg-white px-5 pt-3">
          <View className="h-1 w-10 self-center rounded-full bg-[#cbd5e1]" />
          <Text className="mt-4 text-xl font-bold text-[#263342]">Add expense</Text>

          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-3 py-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text className="mb-1 text-sm font-semibold text-[#445160]">Title</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="h-11 rounded-xl border border-[#d5dde7] px-3 text-base text-[#263342]"
                    placeholder="e.g. Team dinner"
                    placeholderTextColor="#94a3b8"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.title?.message ? (
                <Text className="mt-1 text-xs text-red-500">{errors.title.message}</Text>
              ) : null}
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-[#445160]">Paid by</Text>
              <View className="flex-row flex-wrap gap-2">
                {dummyTripMembers.map((member) => {
                  const isSelected = paidByMemberId === member.id;
                  return (
                    <Pressable
                      key={member.id}
                      className="rounded-full border px-3 py-2"
                      style={{
                        backgroundColor: isSelected ? "#dff2f3" : "#ffffff",
                        borderColor: isSelected ? "#238688" : "#d5dde7",
                      }}
                      onPress={() =>
                        setValue("paidByMemberId", member.id, { shouldValidate: true })
                      }
                    >
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? "#176a6d" : "#647184" }}
                      >
                        {member.profile.displayName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-[#445160]">how much</Text>
              <Controller
                control={control}
                name="price"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="h-11 w-full rounded-xl border border-[#d5dde7] px-3 text-base text-[#263342]"
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor="#94a3b8"
                    value={value === undefined ? "" : String(value)}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.price?.message ? (
                <Text className="mt-1 text-xs text-red-500">{errors.price.message}</Text>
              ) : null}
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-[#445160]">Split with</Text>
              <View className="flex-row flex-wrap gap-2">
                {dummyTripMembers.map((member) => {
                  const isSelected = selectedMemberIds.includes(member.id);
                  return (
                    <Pressable
                      key={member.id}
                      className="rounded-full border px-3 py-2"
                      style={{
                        backgroundColor: isSelected ? "#dff2f3" : "#ffffff",
                        borderColor: isSelected ? "#238688" : "#d5dde7",
                      }}
                      onPress={() => toggleMember(member.id)}
                    >
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? "#176a6d" : "#647184" }}
                      >
                        {member.profile.displayName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {selectedMembers.length > 0 ? (
                <View className="mt-3 flex-row items-center gap-2">
                  <Text className="text-xs text-[#647184]">Selected</Text>
                  <MemberAvatars members={selectedMembers} maxDisplay={10} />
                </View>
              ) : null}
              {errors.oweMemberIds?.message ? (
                <Text className="mt-1 text-xs text-red-500">
                  {errors.oweMemberIds.message}
                </Text>
              ) : null}
            </View>

            <View>
              <Text className="mb-2 text-sm font-semibold text-[#445160]">How to split</Text>
              <View className="flex-row gap-2">
                {[
                  { label: "Equal split", value: "EQUAL" as const },
                  { label: "Custom", value: "CUSTOM" as const },
                ].map((option) => {
                  const isSelected = splitType === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      className="flex-1 items-center rounded-xl border px-3 py-3"
                      style={{
                        backgroundColor: isSelected ? "#dff2f3" : "#ffffff",
                        borderColor: isSelected ? "#238688" : "#d5dde7",
                      }}
                      onPress={() =>
                        setValue("splitType", option.value, { shouldValidate: true })
                      }
                    >
                      <Text
                        className="text-sm font-bold"
                        style={{ color: isSelected ? "#176a6d" : "#647184" }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {splitType === "CUSTOM" ? (
                <View className="mt-3 gap-2 rounded-xl bg-[#f7fafc] p-3">
                  {dummyTripMembers
                    .filter((member) => selectedMemberIds.includes(member.id))
                    .map((member) => (
                      <View key={member.id} className="flex-row items-center gap-3">
                        <Text className="flex-1 text-sm font-semibold text-[#445160]">
                          {member.profile.displayName}
                        </Text>
                        <TextInput
                          keyboardType="decimal-pad"
                          placeholder="0.00"
                          placeholderTextColor="#94a3b8"
                          style={{
                            height: 40,
                            width: 112,
                            borderWidth: 1,
                            borderColor: "#d5dde7",
                            borderRadius: 8,
                            backgroundColor: "#ffffff",
                            paddingHorizontal: 12,
                            color: "#263342",
                            fontSize: 16,
                            textAlign: "right",
                          }}
                          value={customSplitInputs[member.id] ?? ""}
                          onChangeText={(value) => updateCustomSplit(member.id, value)}
                        />
                      </View>
                    ))}
                  <View className="mt-1 flex-row justify-between border-t border-[#dce5ed] pt-2">
                    <Text className="text-xs font-semibold text-[#647184]">Custom total</Text>
                    <Text className="text-xs font-bold text-[#263342]">{customTotal.toFixed(2)}</Text>
                  </View>
                  {customSplitsErrorMessage ? (
                    <Text className="text-xs text-red-500">{customSplitsErrorMessage}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View>
              <Text className="mb-1 text-sm font-semibold text-[#445160]">Details (optional)</Text>
              <Controller
                control={control}
                name="note"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="min-h-[72px] rounded-xl border border-[#d5dde7] px-3 py-2 text-base text-[#263342]"
                    multiline
                    placeholder="Add an optional note"
                    placeholderTextColor="#94a3b8"
                    textAlignVertical="top"
                    value={value ?? ""}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            <View
              className="flex-row gap-3 border-t border-[#edf0f4] pt-3"
              style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl border border-[#cbd5e1] active:opacity-60"
                onPress={handleClose}
              >
                <Text className="text-base font-bold text-[#647184]">Close</Text>
              </Pressable>
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl bg-[#238688] active:opacity-80"
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-base font-bold text-white">Register</Text>
              </Pressable>
            </View>
          </ScrollView>

        </View>
      </KeyboardAvoidingView>
      {keyboardVisible ? <KeyboardDismissButton keyboardHeight={keyboardHeight} onPress={dismissKeyboard} /> : null}
    </Modal>
  );
};

export default AddExpenseModal;
