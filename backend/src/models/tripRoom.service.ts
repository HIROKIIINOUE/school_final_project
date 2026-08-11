import { generateInviteCode } from "../lib/generateInviteCode";
import { isInviteCodeCollision } from "../lib/isInviteCodeCollision";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/appError";

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
          description: true,
          _count: { select: { members: true } }, // It is counting how many matching trip id appear in trip_members table
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  if (!memberships) {
    console.log("Can't find memberships");
    throw new AppError(
      404,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

  const myTrips = memberships.map((mem) => ({
    title: mem.trip.title,
    id: mem.trip.id,
    description: mem.trip.description || null,
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
    console.error("Failed to create room: ", e);

    if (isInviteCodeCollision(e) && attemptCount < maximumRetryCount) {
      return createRoom(data, attemptCount + 1);
    }

    throw e;
  }
}

async function updateMyTrips(data: {
  id: string;
  userId: string;
  title: string;
  description: string | null;
}) {
  const { id, userId, title, description } = data;

  const membership = await prisma.tripMember.findFirst({
    where: { tripId: id, userId },
    select: { id: true },
  });

  if (!membership) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

  const result = await prisma.trip.update({
    where: { id },
    data: { title, description },
  });

  return result;
}

async function joinTrip({
  inviteCode,
  userId,
}: {
  inviteCode: string;
  userId: string;
}) {
  const trip = await prisma.trip.findUnique({ where: { inviteCode } });

  if (!trip) {
    throw new AppError(
      404,
      "INVALID_INVITE_CODE",
      "The invite code is invalid.",
    );
  }
}

export { getMyRooms, createRoom, updateMyTrips };
