import { View, Text } from "react-native";
import React from "react";
import { TripDetailsType } from "../types/types";
import { CalendarDays, MapPin } from "lucide-react-native";
import { calculateDuration, calculatePeriod } from "@/lib/calculatePeriod";

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

  const duration = tripDetails.startDate
    ? calculateDuration(tripDetails.startDate, tripDetails.endDate)
    : "-";

  return (
    <View className="relative z-20 -mt-10 mx-container-margin bg-white rounded-[24px] p-lg shadow-sm border border-outline-variant/30 flex flex-col gap-sm">
      <View className="flex items-center gap-sm flex-wrap">
        <View className="px-sm py-xs bg-primary-container text-on-primary-container rounded-md text-label-md font-label-md font-bold">
          <Text>{status}</Text>
        </View>
        <View className="px-sm py-xs bg-surface-variant text-on-surface-variant rounded-md text-label-md font-label-md">
          <Text>
            {tripDetails.currentUserRole === "OWNER" ? "Owner" : "Member"}
          </Text>
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
          <Text>{tripDetails.destination ?? "Unprovided"}</Text>
        </View>
        <View className="flex items-center gap-sm">
          <View className="material-symbols-outlined text-[18px]">
            <CalendarDays />
          </View>
          <Text>
            {tripDetails.startDate
              ? `${calculatePeriod(tripDetails.startDate, tripDetails.endDate)}, ${new Date(tripDetails.startDate).getFullYear()} • ${duration}`
              : "Unprovided"}
          </Text>
        </View>
      </View>
      <View className="mt-sm p-sm bg-surface-container rounded-lg border border-primary/20">
        <Text className="text-title-md font-title-md text-primary text-center">
          {tripDetails.planningStatus.daysUntilStart}
        </Text>
      </View>
    </View>
  );
};

export default TripDetail;
