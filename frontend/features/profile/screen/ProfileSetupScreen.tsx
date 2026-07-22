import { Stack } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner";
import ProfileDetailsForm from "../components/ProfileDetailsForm";
import { useCreateProfile } from "../hooks/useCreateProfile";
import { ProfileFormValues } from "../types/profileForm.type";

const ProfileSetupScreen = () => {
  const [values, setValues] = useState<ProfileFormValues>({ displayName: "" });
  const { createdProfile, isSubmitting, submitProfile } = useCreateProfile();
  const isContinueDisabled =
    !values.displayName.trim() || isSubmitting || createdProfile !== null;

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
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Set up profile" }} />
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>?</Text>
            </View>
            <Text style={styles.kicker}>ONE LAST STEP</Text>
            <Text style={styles.title}>Tell us what to call you</Text>
            <Text style={styles.subtitle}>
              Set up your profile before you start planning trips with friends.
            </Text>
          </View>

          <View style={styles.card}>
            <ProfileDetailsForm
              values={values}
              onChangeDisplayName={(displayName) => setValues({ displayName })}
            />
            <Pressable
              accessibilityRole="button"
              disabled={isContinueDisabled}
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.continueButton,
                isContinueDisabled && styles.continueButtonDisabled,
                pressed && !isContinueDisabled && styles.continueButtonPressed,
              ]}
            >
              <Text style={styles.continueButtonLabel}>
                {isSubmitting ? "Saving..." : "Continue"}
              </Text>
            </Pressable>
            <Text style={styles.footnote}>
              {createdProfile
                ? `Profile saved as ${createdProfile.displayName}.`
                : "You can add a profile picture later."}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f4f7fb",
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  content: {
    flex: 1,
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: 18,
  },
  avatarPlaceholder: {
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderColor: "#bae6fd",
    borderRadius: 36,
    borderWidth: 1,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  avatarInitial: {
    color: "#0369a1",
    fontSize: 30,
    fontWeight: "700",
  },
  kicker: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    lineHeight: 16,
    marginTop: 22,
  },
  title: {
    color: "#0f172a",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.6,
    lineHeight: 37,
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#667085",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderColor: "#e4ebf5",
    borderRadius: 28,
    borderWidth: 1,
    marginTop: 32,
    padding: 24,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 14,
    marginTop: 24,
    minHeight: 54,
    justifyContent: "center",
  },
  continueButtonDisabled: {
    opacity: 0.45,
  },
  continueButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
  continueButtonLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  footnote: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
    textAlign: "center",
  },
});

export default ProfileSetupScreen;
