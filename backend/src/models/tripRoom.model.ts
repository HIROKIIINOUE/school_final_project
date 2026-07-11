import { prisma } from "../lib/prisma";

async function getMyRooms(userId: string) {
  // get all user's joined rooms
  prisma.tripMember.findMany({
    where: { userId },
    select: {
      role: true,
      trip: {
        select: {
          id: true,
          title: true,
          _count: { select: { members: true } }, // It is counting how many matching trip id appear in trip_members table
        },
      },
    },
  });
}

async function createRoom() {
  // create room
}

export { getMyRooms };
