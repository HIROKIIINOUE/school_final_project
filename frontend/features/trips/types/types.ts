export type MyRoomType = {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  memberCount: number;
  isOwner: boolean;
};

export type CreateMyRoomsInput = { title: string; description?: string | null };

export type UpdateMyRoomInput = {
  title: string;
  description?: string | null;
  tripId: string;
  destination: string | null;
  startTime: Date | null;
  endTime: Date | null;
};

export type DeleteTripResult = { tripId: string };
