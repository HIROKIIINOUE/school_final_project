import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { getOverviewData } from "../api/overview.api";
import { OverviewDataType } from "../types/types";
import Spinner from "@/components/Spinner";
import TripDetail from "../components/TripDetail";

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
        setIsLoading(true);
      }
    }

    fetchOverview();
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!overviewData?.tripDetails) {
    return (
      <View>
        <Text>No overview yet</Text>
      </View>
    );
  }

  return (
    <View>
      <TripDetail tripDetails={overviewData?.tripDetails} />
    </View>
  );
};

export default OverView;
