import { Stack } from "expo-router";
import React, { useMemo } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OAuthContinueButtons from "../components/OAuthContinueButtons";
import { OAuthProviderId } from "../types/provider.type";

const LoginScreen = () => {
  const oAuthProviders = useMemo<OAuthProviderId[]>(
    () => (Platform.OS === "ios" ? ["apple", "google"] : ["google"]),
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Gowbie" }} />
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.logoFrame}>
              <Image
                source={require("../../../assets/images/icon.png")}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
            <View style={styles.copy}>
              <Text style={styles.kicker}>Shared trip planning</Text>
              <Text style={styles.title}>Welcome to Gowbie</Text>
              <Text style={styles.subtitle}>
                Let&apos;s start a trip with your besties
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <View>
              <Text style={styles.eyebrow}>Sign in</Text>
            </View>
            <View style={styles.buttonGroup}>
              <OAuthContinueButtons providers={oAuthProviders} />
            </View>
            <Text style={styles.footnote}>
              We only use your account to sign you in securely.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f7fb" },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 0,
    position: "relative",
    overflow: "hidden",
  },

  content: { flex: 1, justifyContent: "flex-start" },
  hero: { alignItems: "center" },
  logoFrame: {
    width: 124,
    height: 124,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: "#e5edf6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#64748b",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  logo: { width: 88, height: 88, borderRadius: 24 },
  copy: { marginTop: 28, alignItems: "center", paddingHorizontal: 18 },
  kicker: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
    color: "#0f766e",
  },
  title: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.8,
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 25,
    color: "#667085",
    maxWidth: 280,
  },
  card: {
    marginTop: 22,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#e4ebf5",
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 24,
    shadowColor: "#64748b",
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 4,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#0f766e",
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: "#667085",
  },
  buttonGroup: { marginTop: 20 },
  footnote: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#94a3b8",
  },
});

export default LoginScreen;
