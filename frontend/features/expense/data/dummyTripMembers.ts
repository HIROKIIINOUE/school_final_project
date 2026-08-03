import { Profile } from "@/features/profile/types/profile.type";

export type TripMemberWithProfile = {
  id: string;
  tripId: string;
  userId: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
  profile: Profile;
};

const dummyTripId = "3d3f8f46-10c1-4a8b-91b4-524db94a8b17";
const joinedAt = "2026-07-26T00:00:00.000Z";

export const dummyTripMembers: TripMemberWithProfile[] = [
  {
    id: "bf96fb40-86c4-4e1d-8a3e-c2f5e7fd9ca3",
    tripId: dummyTripId,
    userId: "edccf884-7660-48f3-a70a-b6622ec2cb83",
    role: "OWNER",
    joinedAt,
    profile: {
      id: 1,
      userId: "edccf884-7660-48f3-a70a-b6622ec2cb83",
      displayName: "Hiroki",
      image: "https://i.pravatar.cc/64?img=12",
      createdAt: joinedAt,
      updatedAt: joinedAt,
    },
  },
  {
    id: "ca6fd4cd-424a-4b97-aa12-0a59e880e2b1",
    tripId: dummyTripId,
    userId: "322ca5bd-dd82-4ae5-a390-2ed1a1e16bb3",
    role: "MEMBER",
    joinedAt,
    profile: {
      id: 2,
      userId: "322ca5bd-dd82-4ae5-a390-2ed1a1e16bb3",
      displayName: "Takaki",
      image: "https://i.pravatar.cc/64?img=47",
      createdAt: joinedAt,
      updatedAt: joinedAt,
    },
  },
  {
    id: "744434ec-5570-4d78-8fed-0f77016e1bdf",
    tripId: dummyTripId,
    userId: "7fa454e4-618f-430a-9f3f-7bec6d505643",
    role: "MEMBER",
    joinedAt,
    profile: {
      id: 3,
      userId: "7fa454e4-618f-430a-9f3f-7bec6d505643",
      displayName: "Taisei",
      image: null,
      createdAt: joinedAt,
      updatedAt: joinedAt,
    },
  },
  {
    id: "43349880-99d3-45cb-b1ed-1e46dfd65da6",
    tripId: dummyTripId,
    userId: "f61ab183-e941-4417-8bb9-03fccb8601fa",
    role: "MEMBER",
    joinedAt,
    profile: {
      id: 4,
      userId: "f61ab183-e941-4417-8bb9-03fccb8601fa",
      displayName: "Suzuna",
      image: null,
      createdAt: joinedAt,
      updatedAt: joinedAt,
    },
  },
];
