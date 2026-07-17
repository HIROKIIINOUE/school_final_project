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
    <View className="relative card mx-sm">
      <View className="flex items-center gap-sm flex-wrap flex-row">
        <View className="px-sm py-xs bg-primary-container text-on-primary-container rounded-md label-md font-bold badge badge-text">
          <Text>{status}</Text>
        </View>
        <View
          className={`${tripDetails.currentUserRole === "OWNER" ? "badge-primary badge-primary-text" : "badge-secondary"} px-sm py-xs bg-surface-variant text-on-surface-variant rounded-md label-md`}
        >
          <Text>
            {tripDetails.currentUserRole === "OWNER" ? "Owner" : "Member"}
          </Text>
        </View>
      </View>
      <Text className="headline-lg-mobile md:headline-lg text-on-surface font-bold tracking-tight headline-lg py-md">
        {tripDetails.title}
      </Text>
      <View className="flex flex-col gap-sm mt-xs body-md text-on-surface-variant">
        <View className="flex items-center gap-sm flex-row">
          <View className="text-[18px]">
            <MapPin />
          </View>
          <Text className="text-muted">
            {tripDetails.destination ?? "Unprovided"}
          </Text>
        </View>
        <View className="flex items-center gap-sm flex-row">
          <View className="text-[18px]">
            <CalendarDays />
          </View>
          <Text className="text-muted">
            {tripDetails.startDate
              ? `${calculatePeriod(tripDetails.startDate, tripDetails.endDate)}, ${new Date(tripDetails.startDate).getFullYear()} • ${duration}`
              : "Unprovided"}
          </Text>
        </View>
      </View>
      {true && (
        <View className="mt-sm p-sm bg-surface-container rounded-lg border border-primary/20">
          <Text className="title-md text-primary text-center">
            {/* {tripDetails.planningStatus.daysUntilStart} */}
            10 days until departure!
          </Text>
        </View>
      )}
    </View>
  );
};

export default TripDetail;
