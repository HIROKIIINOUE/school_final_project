import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { getOverviewData } from "../api/overview.api";
import { OverviewDataType } from "../types/types";
import Spinner from "@/components/Spinner";
import TripDetail from "../components/TripDetail";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = { id: string };

const OverView = ({ id }: Props) => {
  const [overviewData, setOverviewData] = useState<OverviewDataType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
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

    fetchOverview();
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  console.log(overviewData);

  if (!overviewData?.tripDetails) {
    return (
      <View>
        <Text>No overview yet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
      <ScrollView>
        <TripDetail tripDetails={overviewData?.tripDetails} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OverView;
