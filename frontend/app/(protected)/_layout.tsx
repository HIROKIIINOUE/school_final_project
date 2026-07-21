import { Stack } from "expo-router";
import "../../globals.css";

export default function RootLayout() {
  // is not logged in => redirect to login
  return <Stack />;
}
