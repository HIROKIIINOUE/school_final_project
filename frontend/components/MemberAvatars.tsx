import { Image, Text, View } from "react-native";

import React from "react";
type Props = {
  members: { id: number; displayName: string; image: string | null }[];
  maxDisplay: number;
};

const MemberAvatars = (props: Props) => {
  const { members, maxDisplay } = props;
  return (
    <View className="flex-row items-center">
      {members.map((member, index) => {
        if (index < maxDisplay) {
          if (!member.image) {
            return (
              <View
                key={member.id}
                className={`h-7 w-7 items-center justify-center rounded-full border border-white ${index > 0 ? "-ml-1" : ""
                  } ${index === 0 ? "bg-[#d9b59f]" : index % 2 === 0 ? "bg-[#7896aa]" : "bg-[#c6a579]"}`}
              >
                <Text className="text-[8px] font-bold text-white">
                  {member.displayName[0]}
                </Text>
              </View>
            );
          } else {
            return (
              <View
                key={member.id}
                className={`h-7 w-7 overflow-hidden rounded-full border border-white ${index > 0 ? "-ml-1" : ""}`}
              >
                <Image
                  accessibilityLabel={`${member.displayName}'s avatar`}
                  className="h-full w-full"
                  resizeMode="cover"
                  source={{ uri: member.image }}
                />
              </View>
            );
          }
        }
      })}
      {members.length - maxDisplay > 0 ? (
        <View className="-ml-1 h-7 w-7 items-center justify-center rounded-full border border-white bg-[#dce2ea]">
          <Text className="text-[9px] font-bold text-[#738093]">
            +{members.length - maxDisplay}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default MemberAvatars;
