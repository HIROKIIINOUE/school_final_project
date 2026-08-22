import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { getOverviewData } from "../api/overview.api";
import { OverviewDataType } from "../types/types";
import Spinner from "@/components/Spinner";
import TripDetail from "../components/TripDetail";
import { SafeAreaView } from "react-native-safe-area-context";
import OverviewThumbnail from "../components/OverviewThumbnail";
import ItineraryCard from "../components/ItineraryCard";
import { Share2 } from "lucide-react-native";
import InviteCodeModal from "../components/InviteCodeModal";

type Props = { id: string };
type OverviewStatus = "loading" | "success" | "error";

const OverView = ({ id }: Props) => {
  const [overviewData, setOverviewData] = useState<OverviewDataType>();
  const [status, setStatus] = useState<OverviewStatus>("loading");

  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);

  async function fetchOverview() {
    try {
      setStatus("loading");
      const overview = await getOverviewData({ id });
      setOverviewData(overview);
      setStatus("success");
    } catch (e) {
      setStatus("error");
    }
  }
  useEffect(() => {
    fetchOverview();
  }, [id]);

  if (status === "loading") {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner />
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="items-center justify-center px-lg"
      >
        <Text className="headline-lg-mobile">Unable to load trip</Text>

        <Text className="mt-sm text-center text-on-surface-variant">
          Something went wrong while loading this trip.
        </Text>

        <Pressable className="btn-primary mt-lg" onPress={fetchOverview}>
          <Text className="btn-primary-text">Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!overviewData?.tripDetails) {
    return (
      <View className="empty-state">
        <Text className="empty-title">No overview yet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <OverviewThumbnail />
      <ScrollView>
        <Pressable
          className="btn-primary m-md flex flex-row items-center gap-2"
          onPress={() => setInviteModalOpen(true)}
        >
          <Share2 />
          <Text className="btn-primary-text headline-lg-mobile">
            Invite your friends
          </Text>
        </Pressable>
        <TripDetail
          tripDetails={overviewData?.tripDetails}
          onTripUpdate={fetchOverview}
          members={overviewData.members}
        />
        <ItineraryCard itineraries={overviewData.itineraries} tripId={id} />
      </ScrollView>

      {inviteModalOpen && (
        <InviteCodeModal
          onClose={() => setInviteModalOpen(false)}
          visible={inviteModalOpen}
          trip={overviewData.tripDetails}
        />
      )}
    </SafeAreaView>
  );
};

export default OverView;
