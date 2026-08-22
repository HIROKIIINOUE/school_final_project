import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { OverviewMemberType, TripDetailsType } from "../types/types";
import { CalendarDays, MapPin, SquarePen } from "lucide-react-native";
import { calculateDuration, calculatePeriod } from "@/lib/calculatePeriod";
import TripRoomEditModal from "./TripRoomEditModal";
import MemberAvatars from "@/components/MemberAvatars";

type Props = {
  tripDetails: TripDetailsType;
  onTripUpdate: () => void;
  members: OverviewMemberType[];
};

const TripDetail = ({ tripDetails, onTripUpdate, members }: Props) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

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
      {editModalOpen && (
        <TripRoomEditModal
          trip={tripDetails}
          closeModal={() => setEditModalOpen(false)}
          onTripUpdate={onTripUpdate}
        />
      )}
      <View className="flex items-center gap-sm flex-wrap flex-row justify-between">
        <View className="flex flex-row items-center gap-sm ">
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
        <View className=" bg-primary-fixed rounded-full p-sm">
          <Pressable onPress={() => setEditModalOpen(true)}>
            <SquarePen color="white" />
          </Pressable>
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
              ? `${calculatePeriod(tripDetails.startDate, tripDetails.endDate)}, ${new Date(tripDetails.startDate).getFullYear()}`
              : "Unprovided"}
          </Text>
        </View>
        <View className="flex flex-row gap-md items-center">
          <MemberAvatars
            members={members.map((mem) => ({
              id: mem.userId,
              displayName: mem.profile?.displayName ?? "",
              image: mem.profile?.image ?? null,
            }))}
            maxDisplay={5}
          />
        </View>
        <Text className="text-muted">{members.length} members</Text>
      </View>
      {true && (
        <View className="mt-sm p-sm bg-surface-container rounded-lg border border-primary/20">
          <Text className="title-md text-primary text-center">
            {tripDetails.planningStatus.daysUntilStart
              ? `${tripDetails.planningStatus.daysUntilStart} days untill departure!`
              : tripDetails.planningStatus.status}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TripDetail;
