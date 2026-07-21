import { StyleSheet, Text, TextInput, View } from "react-native";
import { ProfileFormValues } from "../types/profileForm.type";

type Props = {
  values: ProfileFormValues;
  onChangeDisplayName: (displayName: string) => void;
};

const ProfileDetailsForm = ({ values, onChangeDisplayName }: Props) => {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Display name</Text>
      <TextInput
        accessibilityLabel="Display name"
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={10}
        onChangeText={onChangeDisplayName}
        placeholder="How should your friends call you?"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={values.displayName}
      />
      <Text style={styles.helperText}>
        This name will be visible to the people you travel with.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    width: "100%",
  },
  label: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d7e1ee",
    borderRadius: 14,
    borderWidth: 1,
    color: "#0f172a",
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  helperText: {
    color: "#667085",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
});

export default ProfileDetailsForm;
