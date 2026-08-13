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
};

export type DeleteTripResult = { tripId: string };
