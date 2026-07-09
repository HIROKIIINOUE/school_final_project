import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function TripsScreen() {
  return (
    <View className="w-full max-w-[1200px] self-center px-container py-lg gap-lg">
      {/* Action Area */}
      <View className="flex-row gap-md md:w-1/2 lg:w-1/3">
        <Pressable className="flex-1 bg-primary-container py-sm px-md rounded-app-full flex-row items-center justify-center gap-sm active:opacity-90">
          <MaterialIcons name="add" size={18} className="text-on-primary" />
          <Text className="font-sans text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-on-primary">
            Create Trip
          </Text>
        </Pressable>

        <Pressable className="flex-1 bg-secondary-container py-sm px-md rounded-app-full flex-row items-center justify-center gap-sm active:opacity-90">
          <MaterialIcons name="group-add" size={18} className="text-primary" />
          <Text className="font-sans text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-primary">
            Join Trip
          </Text>
        </Pressable>
      </View>

      {/* Trips List */}
      <View className="gap-md">
        {/* Card 1 */}
        <Pressable className="bg-[white] rounded-app-lg border border-outline-variant p-md gap-md relative overflow-hidden active:shadow-md">
          <View className="absolute top-0 left-0 w-1 h-full bg-primary" />

          <View className="flex-row justify-between items-start pl-sm">
            <View>
              <Text className="font-sans text-[18px] font-semibold leading-[24px] text-on-surface">
                Tokyo Summer Adventure
              </Text>

              <View className="mt-xs flex-row items-center gap-sm">
                <MaterialIcons
                  name="calendar-month"
                  size={16}
                  className="text-on-surface-variant"
                />
                <Text className="font-sans text-[14px] font-normal leading-[20px] text-on-surface-variant">
                  Aug 10 - Aug 20
                </Text>
              </View>
            </View>

            <View className="bg-secondary-container px-sm py-xs rounded-app-full flex-row items-center gap-xs shrink-0">
              <MaterialIcons name="star" size={14} className="text-primary" />
              <Text className="font-sans text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-primary">
                Owner
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-sm pl-sm pt-sm border-t border-outline-variant/50">
            <MaterialIcons
              name="group"
              size={20}
              className="text-on-surface-variant"
            />
            <Text className="font-sans text-[14px] font-normal leading-[20px] text-on-surface-variant">
              4 members
            </Text>
          </View>

          <View className="bg-surface-container-low rounded-app p-sm gap-xs mt-xs ml-sm">
            <View className="flex-row items-center gap-sm">
              <MaterialIcons
                name="flight-takeoff"
                size={18}
                className="text-primary"
              />
              <Text className="font-sans text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-primary">
                Next Up
              </Text>
            </View>

            <Text className="font-sans text-[14px] font-normal leading-[20px] text-on-surface pl-7">
              ANA flight tomorrow 13:40
            </Text>

            <View className="flex-row items-center gap-sm pl-7 mt-xs">
              <MaterialIcons name="warning" size={14} className="text-error" />
              <Text className="font-sans text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-error">
                2 confirmations missing
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Card 2 */}
        <Pressable className="bg-[white] rounded-app-lg border border-outline-variant p-md gap-md relative overflow-hidden active:shadow-md">
          <View className="absolute top-0 left-0 w-1 h-full bg-outline" />

          <View className="flex-row justify-between items-start pl-sm">
            <View>
              <Text className="font-sans text-[18px] font-semibold leading-[24px] text-on-surface">
                Alpine Ski Trip
              </Text>

              <View className="mt-xs flex-row items-center gap-sm">
                <MaterialIcons
                  name="calendar-month"
                  size={16}
                  className="text-on-surface-variant"
                />
                <Text className="font-sans text-[14px] font-normal leading-[20px] text-on-surface-variant">
                  Dec 15 - Dec 22
                </Text>
              </View>
            </View>

            <View className="bg-surface-variant px-sm py-xs rounded-app-full flex-row items-center gap-xs shrink-0">
              <MaterialIcons
                name="person"
                size={14}
                className="text-on-surface-variant"
              />
              <Text className="font-sans text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-on-surface-variant">
                Member
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-sm pl-sm pt-sm border-t border-outline-variant/50">
            <MaterialIcons
              name="group"
              size={20}
              className="text-on-surface-variant"
            />
            <Text className="font-sans text-[14px] font-normal leading-[20px] text-on-surface-variant">
              6 members
            </Text>
          </View>

          <View className="bg-surface-container-low rounded-app p-sm gap-xs mt-xs ml-sm">
            <View className="flex-row items-center gap-sm">
              <MaterialIcons
                name="restaurant"
                size={18}
                className="text-primary"
              />
              <Text className="font-sans text-[12px] font-medium uppercase leading-[16px] tracking-[0.05em] text-primary">
                Next Up
              </Text>
            </View>

            <Text className="font-sans text-[14px] font-normal leading-[20px] text-on-surface pl-7">
              Dinner at The Lodge 19:00
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
