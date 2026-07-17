import React from "react";
import { Pressable, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { OAuthProviderId } from "../screen/LoginScreen";

type Props = { providers: OAuthProviderId[] };

const OAuthContinueButtonsNativeWind = ({ providers }: Props) => {
  const labelByProvider: Record<OAuthProviderId, string> = {
    apple: "Continue with Apple",
    google: "Continue with Google",
  };

  return (
    <View className="w-full">
      {providers.map((provider, index) => {
        const label = labelByProvider[provider];
        const isLast = index === providers.length - 1;

        return (
          <Pressable
            key={provider}
            accessibilityRole="button"
            className={`min-h-[58px] w-full flex-row items-center rounded-[18px] border border-[#d7e1ee] bg-white px-[18px] py-[14px] ${isLast ? "" : "mb-[14px]"}`}
          >
            {provider === "google" ? (
              <AntDesign name="google" size={18} color="#0f172a" />
            ) : (
              <AntDesign name="apple" size={18} color="#0f172a" />
            )}
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="ml-3 flex-1 text-[15px] font-semibold leading-5 text-[#1f2937]"
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default OAuthContinueButtonsNativeWind;
