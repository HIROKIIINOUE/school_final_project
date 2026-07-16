import { View, Text } from "react-native";
import React from "react";
import { TripDetailsType } from "../types/types";
import { CalendarDays, MapPin } from "lucide-react-native";

type Props = { tripDetails: TripDetailsType };

const TripDetail = ({ tripDetails }: Props) => {
  const status =
    tripDetails.planningStatus.status === "UPCOMING"
      ? "Upcoming"
      : tripDetails.planningStatus.status === "STARTING_SOON"
        ? "Starting Soon"
        : tripDetails.planningStatus.status === "DATES_NOT_SET"
          ? "Dates not set"
          : tripDetails.planningStatus.status === "IN_PROGRESS"
            ? "Planning"
            : "Completed";
  return (
    <View className="relative z-20 -mt-10 mx-container-margin bg-white rounded-[24px] p-lg shadow-sm border border-outline-variant/30 flex flex-col gap-sm">
      <View className="flex items-center gap-sm flex-wrap">
        <View className="px-sm py-xs bg-primary-container text-on-primary-container rounded-md text-label-md font-label-md font-bold">
          {status}
        </View>
        <View className="px-sm py-xs bg-surface-variant text-on-surface-variant rounded-md text-label-md font-label-md">
          {tripDetails.currentUserRole === "OWNER" ? "Owner" : "Member"}
        </View>
      </View>
      <Text className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface font-bold tracking-tight">
        {tripDetails.title}
      </Text>
      <View className="flex flex-col gap-xs mt-xs text-body-md font-body-md text-on-surface-variant">
        <View className="flex items-center gap-sm">
          <View className="material-symbols-outlined text-[18px]">
            <MapPin />
          </View>
          <View>{tripDetails.destination ?? "Unprovided"}</View>
        </View>
        <View className="flex items-center gap-sm">
          <View className="material-symbols-outlined text-[18px]">
            <CalendarDays />
          </View>
          <View>August 10 – 20, 2026 • 11 days</View>
        </View>
      </View>
      <View className="mt-sm p-sm bg-surface-container rounded-lg border border-primary/20">
        <Text className="text-title-md font-title-md text-primary text-center">
          29 days until departure
        </Text>
      </View>
    </View>
  );
};

export default TripDetail;
