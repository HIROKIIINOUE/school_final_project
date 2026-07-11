import { generateInviteCode } from "../lib/generateInviteCode";
import { isInviteCodeCollision } from "../lib/isInviteCodeCollision";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

async function getMyRooms(userId: string) {
  // get all user's joined rooms

  const memberships = await prisma.tripMember.findMany({
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
    orderBy: { joinedAt: "desc" },
  });

  if (!memberships) {
    throw new AppError(
      404,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

  const myTrips = memberships.map((mem) => ({
    title: mem.trip.title,
    id: mem.trip.id,
    memberCount: mem.trip._count.members,
    isOwner: mem.role === "OWNER",
  }));

  return myTrips;
}

async function createRoom(
  data: { userId: string; title: string; description: string | null },
  attemptCount = 1,
) {
  const { userId, title, description = null } = data;

  const maximumRetryCount = 3;

  const inviteCode = generateInviteCode();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: { title, ownerId: userId, inviteCode, description },
      });
      await tx.tripMember.create({
        data: { tripId: trip.id, userId, role: "OWNER" },
      });

      return { id: trip.id, title: trip.title };
    });

    return result;
  } catch (e) {
    // if unique constraint error
    // else throw error

    if (isInviteCodeCollision(e) && attemptCount < maximumRetryCount) {
      return createRoom(data, attemptCount + 1);
    }

    throw e;
  }
}

export { getMyRooms, createRoom };
