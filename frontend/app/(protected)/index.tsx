import { Redirect } from "expo-router";

// Temporary entry point for testing the OAuth and profile creation flow.
export default function Index() {
  return <Redirect href="/auth/signIn" />;
}
