import { generateInviteCode } from "../lib/generateInviteCode";
import { isInviteCodeCollision } from "../lib/isInviteCodeCollision";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/appError";
import { isUniqueConstraintError } from "../lib/isPrismaConflictError";
import { isRecordNotFoundError } from "../lib/isRecordNotFoundError";

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
          startDate: true,
          _count: { select: { members: true } }, // It is counting how many matching trip id appear in trip_members table
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const myTrips = memberships.map((mem) => ({
    title: mem.trip.title,
    id: mem.trip.id,
    description: mem.trip.description || null,
    startAt: mem.trip.startDate,
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
  description?: string | null;
  destination?: string | null;
  startTime?: string | null;
  endTime?: string | null;
}) {
  const { id, userId, title, description, destination, startTime, endTime } =
    data;

  const membership = await prisma.tripMember.findFirst({
    where: { tripId: id, userId },
    select: { id: true, trip: { select: { startDate: true, endDate: true } } },
  });

  if (!membership) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

  const nextStartDate =
    startTime === undefined
      ? membership.trip.startDate
      : startTime === null
        ? null
        : new Date(startTime);

  const nextEndDate =
    endTime === undefined
      ? membership.trip.endDate
      : endTime === null
        ? null
        : new Date(endTime);

  // validate end and start time if both are not null
  if (nextStartDate !== null && nextEndDate !== null) {
    const comparableStartDate = new Date(nextStartDate);
    const comparableEndDate = new Date(nextEndDate);

    comparableStartDate.setUTCHours(0, 0, 0, 0);
    comparableEndDate.setUTCHours(0, 0, 0, 0);

    if (comparableStartDate > comparableEndDate) {
      throw new AppError(
        400,
        "INVALID_TRIP_DATE_RANGE",
        "End date cannot be before start date.",
      );
    }
  }

  const result = await prisma.trip.update({
    where: { id },
    data: {
      title,
      ...(description !== undefined && { description }),

      ...(destination !== undefined && { destination }),

      ...(startTime !== undefined && { startDate: startTime }),

      ...(endTime !== undefined && { endDate: endTime }),
    },
  });

  return result;
}

async function deleteRoom({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, ownerId: true },
  });

  if (!trip) {
    throw new AppError(404, "TRIP_NOT_FOUND", "Trip was not found.");
  }

  if (trip.ownerId !== userId) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You don't have permit to execute it",
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.expense.deleteMany({ where: { tripId } });
      await tx.trip.delete({ where: { id: tripId } });
    });
  } catch (e) {
    if (!isRecordNotFoundError(e)) {
      throw e;
    }
  }

  return { tripId };
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

  // add user to the trip
  try {
    const createdMember = await prisma.tripMember.create({
      data: { tripId: trip.id, userId },
    });

    return { trip, membership: createdMember, alreadyMember: false };
  } catch (e) {
    // if a user is already a member = unique constraint error
    if (!isUniqueConstraintError(e)) {
      throw e;
    }

    const membership = await prisma.tripMember.findUnique({
      where: { tripId_userId: { tripId: trip.id, userId } },
    });

    if (!membership) {
      throw e;
    }

    return { trip, membership, alreadyMember: true };
  }
}

export { getMyRooms, createRoom, updateMyTrips, deleteRoom, joinTrip };
