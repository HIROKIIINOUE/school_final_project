export type TripPlanningStatus = {
  status:
    | "DATES_NOT_SET"
    | "UPCOMING"
    | "STARTING_SOON"
    | "IN_PROGRESS"
    | "COMPLETED";
  daysUntilStart: number | null;
};

export type TripDetailsType = {
  id: string;
  title: string;
  description: string | null;
  destination: string | null;
  inviteCode: string;
  startDate: Date | null;
  endDate: Date | null;
  currentUserRole: "OWNER" | "MEMBER";
  planningStatus: TripPlanningStatus;
};

export type ItineraryType = {
  id: string;
  title: string;
  location: string | null;
  detail: string | null;
  startTime: Date;
};

export type OverviewDataType = {
  tripDetails: TripDetailsType;
  itineraries: ItineraryType[];
};

export type TripRoomFormType = {
  title: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
};
