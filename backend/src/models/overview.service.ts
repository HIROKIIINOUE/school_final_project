import { getPlanningStatus } from "../lib/getPlanningStatus";
import { prisma } from "../lib/prisma";
import {
  ItineraryType,
  OverviewDataType,
  OverviewMemberType,
  TripDetailsType,
} from "../types/overview.types";
import { AppError } from "../lib/appError";
import { assertTripAccess } from "../lib/assertTripAccess";

// TODO: Add more informatin later on such as expenses, chats etc

async function getTripDetails({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}): Promise<TripDetailsType> {
  // find one trip which mathces with tripId
  // also check if userId is the member of the trip
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, members: { some: { userId } } },
    select: {
      id: true,
      ownerId: true,
      title: true,
      description: true,
      destination: true,
      inviteCode: true,
      startDate: true,
      endDate: true,
      members: { where: { userId: userId }, select: { role: true } },
    },
  });

  if (!trip) {
    throw new AppError(404, "TRIP_NOT_FOUND", "Trip was not found");
  }

  const membership = trip.members[0];

  if (!membership) {
    throw new AppError(404, "TRIP_NOT_FOUND", "Trip was not found.");
  }

  const planningStatus = getPlanningStatus({
    start: trip.startDate,
    end: trip.endDate,
  });
  return {
    id: trip.id,
    title: trip.title,
    description: trip.description,
    destination: trip.destination,
    inviteCode: trip.inviteCode,
    startDate: trip.startDate,
    endDate: trip.endDate,
    currentUserRole: trip.members[0].role,
    planningStatus,
  };
}

async function getItineraries({
  tripId,
}: {
  tripId: string;
}): Promise<ItineraryType[]> {
  const itineraries = await prisma.itineraryItem.findMany({
    where: { tripId: tripId },
    select: {
      id: true,
      title: true,
      location: true,
      detail: true,
      startTime: true,
    },
    orderBy: { startTime: "asc" },
  });

  return itineraries;
}

async function getMembers({
  tripId,
  userId,
}: {
  tripId: string;
  userId: string;
}): Promise<OverviewMemberType[]> {
  await assertTripAccess({ userId, tripId });

  const members = await prisma.tripMember.findMany({
    where: { tripId },
    select: { id: true, userId: true, role: true, joinedAt: true },
    orderBy: [{ joinedAt: "asc" }, { id: "asc" }],
  });
  const memberIds = members.map((mem) => mem.userId); // member ids who belong in this trip
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: memberIds } },
    select: { id: true, userId: true, displayName: true, image: true },
  }); // get profiles of memebers who belong in this trip

  const userPropfileMapping = new Map(
    profiles.map((profile) => [profile.userId, profile]),
  );

  const memberData = members.map((mem) => ({
    ...mem,
    profile: userPropfileMapping.get(mem.userId) ?? null,
  }));

  return memberData;
}

export async function getOverviewData(input: {
  userId: string;
  tripId: string;
}): Promise<OverviewDataType> {
  const tripDetails = await getTripDetails(input);

  const itineraries = await getItineraries({ tripId: input.tripId });

  const members = await getMembers({
    tripId: input.tripId,
    userId: input.userId,
  });

  return { tripDetails, itineraries, members };
}
