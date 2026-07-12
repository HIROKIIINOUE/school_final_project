export type MyRoomType = {
  id: string;
  title: string;
  memberCount: number;
  isOwner: boolean;
};

export type createMyRoomsInput = { title: string; description?: string };
