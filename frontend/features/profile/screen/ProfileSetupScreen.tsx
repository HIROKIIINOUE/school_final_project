import { Stack } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner";
import ProfileDetailsForm from "../components/ProfileDetailsForm";
import { useCreateProfile } from "../hooks/useCreateProfile";
import { ProfileFormValues } from "../types/profileForm.type";
import KeyboardDismissButton from "@/components/keyboard/KeyboardDismissButton";
import { useKeyboard } from "@/components/keyboard/useKeyboard";

const StyledSafeAreaView = styled(SafeAreaView); // <SafeAreaView> has to be captured by selected() in order to apply NativeWind

const ProfileSetupScreen = () => {
  const [values, setValues] = useState<ProfileFormValues>({ displayName: "" });
  const { createdProfile, isSubmitting, submitProfile } = useCreateProfile();
  const isContinueDisabled =
    !values.displayName.trim() || isSubmitting || createdProfile !== null;
  const { keyboardVisible, keyboardHeight, dismissKeyboard } = useKeyboard()

  const handleContinue = async () => {
    try {
      await submitProfile(values.displayName.trim());
      toast.success("Your profile has been created.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to create your profile. Please try again.");
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-[#f4f7fb]">
      <Stack.Screen options={{ title: "Set up profile" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-5 pt-6"
          contentContainerStyle={{
            paddingBottom: keyboardVisible ? 120 : 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center px-[18px]">
            <View className="h-[72px] w-[72px] items-center justify-center rounded-full border border-[#bae6fd] bg-[#e0f2fe]">
              <Text className="text-[30px] font-bold text-[#0369a1]">?</Text>
            </View>
            <Text className="mt-[22px] text-xs font-bold leading-4 tracking-[1.4px] text-[#0f766e]">
              ONE LAST STEP
            </Text>
            <Text className="mt-2.5 text-center text-[30px] font-bold leading-[37px] tracking-[-0.6px] text-[#0f172a]">
              Tell us what to call you
            </Text>
            <Text className="mt-3 text-center text-base leading-6 text-[#667085]">
              Set up your profile before you start planning trips with friends.
            </Text>
          </View>

          <View className="mt-8 rounded-[28px] border border-[#e4ebf5] bg-white/[0.92] p-6 shadow-[0_14px_24px_rgba(100,116,139,0.1)]">
            <ProfileDetailsForm
              values={values}
              onChangeDisplayName={(displayName) => setValues({ displayName })}
            />

            <Pressable
              accessibilityRole="button"
              disabled={isContinueDisabled}
              onPress={handleContinue}
              className="mt-6 min-h-[54px] items-center justify-center rounded-[14px] bg-[#0f766e] disabled:opacity-[0.45] active:scale-[0.995] active:opacity-[0.85]"
            >
              <Text className="text-base font-bold text-white">
                {isSubmitting ? "Saving..." : "Continue"}
              </Text>
            </Pressable>
            <Text className="mt-[14px] text-center text-xs leading-[18px] text-[#94a3b8]">
              {createdProfile
                ? `Profile saved as ${createdProfile.displayName}.`
                : "You can add a profile picture later."}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {keyboardVisible ? <KeyboardDismissButton keyboardHeight={keyboardHeight} onPress={dismissKeyboard} /> : null}
    </StyledSafeAreaView>
  );
};

export default ProfileSetupScreen;
