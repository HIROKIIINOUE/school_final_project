import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";
import { Text, View } from "react-native";
import { CircleCheck, CircleX, Info } from "lucide-react-native";

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#0f9f8f",
        borderLeftWidth: 6,
        minHeight: 72,
        borderRadius: 16,
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
      text2Style={{ fontSize: 14 }}
      text2NumberOfLines={2}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#dc2626",
        borderLeftWidth: 6,
        minHeight: 72,
        borderRadius: 16,
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
      text2Style={{ fontSize: 14 }}
      text2NumberOfLines={2}
    />
  ),

  appSuccess: ({ text1, text2 }) => (
    <View className="mx-4 w-[92%] flex-row items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-lg">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
        <CircleCheck size={22} color="#0f9f8f" />
      </View>

      <View className="flex-1">
        {text1 ? (
          <Text className="text-base font-semibold text-slate-900">
            {text1}
          </Text>
        ) : null}

        {text2 ? (
          <Text className="mt-1 text-sm text-slate-600">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),

  appError: ({ text1, text2 }) => (
    <View className="mx-4 w-[92%] flex-row items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-lg">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
        <CircleX size={22} color="#dc2626" />
      </View>

      <View className="flex-1">
        {text1 ? (
          <Text className="text-base font-semibold text-slate-900">
            {text1}
          </Text>
        ) : null}

        {text2 ? (
          <Text className="mt-1 text-sm text-slate-600">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),

  appInfo: ({ text1, text2 }) => (
    <View className="mx-4 w-[92%] flex-row items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-lg">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
        <Info size={22} color="#2563eb" />
      </View>

      <View className="flex-1">
        {text1 ? (
          <Text className="text-base font-semibold text-slate-900">
            {text1}
          </Text>
        ) : null}

        {text2 ? (
          <Text className="mt-1 text-sm text-slate-600">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),
};
