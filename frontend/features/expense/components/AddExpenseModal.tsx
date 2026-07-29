import { Controller, useWatch } from "react-hook-form";
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
import { Profile } from "@/features/profile/types/profile.type";
import { useAppZodForm } from "@/hooks/useAppZodForm";
import { expenseSchema } from "../schemas/expenseSchema";
import { useKeyboard } from "@/components/keyboard/useKeyboard";
import KeyboardDismissButton from "@/components/keyboard/KeyboardDismissButton";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const teamMembers: Profile[] = [
  { id: 1, userId: "hiroki", displayName: "Hiroki", image: null, createdAt: "2026-07-26T00:00:00.000Z", updatedAt: "2026-07-26T00:00:00.000Z" },
  { id: 2, userId: "takaki", displayName: "Takaki", image: null, createdAt: "2026-07-26T00:00:00.000Z", updatedAt: "2026-07-26T00:00:00.000Z" },
  { id: 3, userId: "taisei", displayName: "Taisei", image: null, createdAt: "2026-07-26T00:00:00.000Z", updatedAt: "2026-07-26T00:00:00.000Z" },
  { id: 4, userId: "suzuna", displayName: "Suzuna", image: null, createdAt: "2026-07-26T00:00:00.000Z", updatedAt: "2026-07-26T00:00:00.000Z" },
];

const AddExpenseModal = ({ visible, onClose }: Props) => {
  const insets = useSafeAreaInsets();
  const { keyboardVisible, keyboardHeight, dismissKeyboard } = useKeyboard()
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useAppZodForm({
    schema: expenseSchema,
    defaultValues: {
      title: "",
      paidBy: teamMembers[0].userId,
      owe_members: [teamMembers[0].userId],
      note: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const paidBy = useWatch({ control, name: "paidBy" });
  const selectedMemberIds = useWatch({ control, name: "owe_members" }) ?? [];

  const selectedMembers = teamMembers.filter((member) =>
    selectedMemberIds.includes(member.userId),
  );

  const toggleMember = (memberUserId: string) => {
    setValue(
      "owe_members",
      selectedMemberIds.includes(memberUserId)
        ? selectedMemberIds.filter((userId) => userId !== memberUserId)
        : [...selectedMemberIds, memberUserId],
      { shouldValidate: true },
    );
  };

  const handleClose = () => {
    reset();
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
        <View className="h-2/3 rounded-t-[28px] bg-white px-5 pt-3">
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
                {teamMembers.map((member) => {
                  const isSelected = paidBy === member.userId;
                  return (
                    <Pressable
                      key={member.id}
                      className="rounded-full border px-3 py-2"
                      style={{
                        backgroundColor: isSelected ? "#dff2f3" : "#ffffff",
                        borderColor: isSelected ? "#238688" : "#d5dde7",
                      }}
                      onPress={() =>
                        setValue("paidBy", member.userId, { shouldValidate: true })
                      }
                    >
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? "#176a6d" : "#647184" }}
                      >
                        {member.displayName}
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
                {teamMembers.map((member) => {
                  const isSelected = selectedMemberIds.includes(member.userId);
                  return (
                    <Pressable
                      key={member.id}
                      className="rounded-full border px-3 py-2"
                      style={{
                        backgroundColor: isSelected ? "#dff2f3" : "#ffffff",
                        borderColor: isSelected ? "#238688" : "#d5dde7",
                      }}
                      onPress={() => toggleMember(member.userId)}
                    >
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? "#176a6d" : "#647184" }}
                      >
                        {member.displayName}
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
              {errors.owe_members?.message ? (
                <Text className="mt-1 text-xs text-red-500">
                  {errors.owe_members.message}
                </Text>
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
