export type TripRoom = {
  id: string;
  title: string;
  memberCount: number;
  isOwner: boolean;
};

export const mockTripRooms: TripRoom[] = [
  {
    id: "trip_1",
    title: "Tokyo Summer Adventure",
    memberCount: 4,
    isOwner: true,
  },
  { id: "trip_2", title: "Osaka Food Weekend", memberCount: 3, isOwner: false },
  { id: "trip_3", title: "Kyoto Autumn Escape", memberCount: 5, isOwner: true },
  { id: "trip_4", title: "Sapporo Snow Trip", memberCount: 2, isOwner: false },
];
