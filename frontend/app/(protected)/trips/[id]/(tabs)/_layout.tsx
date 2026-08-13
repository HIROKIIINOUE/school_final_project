import { Tabs } from "expo-router";
import {
  CalendarDays,
  CircleDollarSign,
  House,
  MessageCircle,
} from "lucide-react-native";

export default function TripTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="itinerary/index"
        options={{
          title: "Itinerary",
          tabBarIcon: ({ color, size }) => (
            <CalendarDays color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat/index"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="expense/index"
        options={{
          title: "expense",
          tabBarIcon: ({ color, size }) => (
            <CircleDollarSign color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="expense/summary/index"
        options={{ href: null }}
      />
    </Tabs>
  );
}
