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

const OverView = ({ id }: Props) => {
  const [overviewData, setOverviewData] = useState<OverviewDataType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);

  async function fetchOverview() {
    try {
      setIsLoading(true);
      const overview = await getOverviewData({ id });
      setOverviewData(overview);
    } catch (e) {
      console.error("Failed to fetch overview data", e);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchOverview();
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner />
      </SafeAreaView>
    );
  }

  console.log(overviewData);

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
