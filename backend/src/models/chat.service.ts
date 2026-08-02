import { Prisma } from "../generated/prisma/client";
import { AppError } from "../lib/appError";
import { prisma } from "../lib/prisma";
import { PostMessageBody } from "../schemas/trips.schema";
import { SavedMessage } from "../types/chat.types";

const messageSelect = {
  id: true,
  userId: true,
  tripId: true,
  clientMessageId: true,
  content: true,
  createdAt: true,
} as const;

type MessageRecord = Prisma.MessageGetPayload<{ select: typeof messageSelect }>;

type SenderProfile = {
  userId: string;
  displayName: string;
  image: string | null;
};

function toSavedMessage({
  message,
  profile,
  currentUserId,
}: {
  message: MessageRecord;
  profile: SenderProfile;
  currentUserId: string;
}): SavedMessage {
  return {
    id: message.id,
    clientMessageId: message.clientMessageId,
    tripId: message.tripId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    sender: {
      id: profile.userId,
      displayName: profile.displayName,
      image: profile.image,
    },
    isSentByCurrentUser: message.userId === currentUserId,
  };
}

async function getMessages({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  const membership = await prisma.tripMember.findUnique({
    where: { tripId_userId: { tripId, userId } },
    select: { id: true },
  });

  if (!membership) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

  const messages = await prisma.message.findMany({
    where: { tripId },
    select: messageSelect,
    take: 30,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  const senderIds: string[] = [];

  for (const msg of messages) {
    if (!senderIds.includes(msg.userId)) {
    }
    senderIds.push(msg.userId);
  }

  const profiles = await prisma.profile.findMany({
    where: { userId: { in: senderIds } },
    select: { userId: true, displayName: true, image: true },
  });

  const profileByUserId = new Map(
    profiles.map((profile) => [profile.userId, profile]),
  );

  return messages.map((message) => {
    const profile = profileByUserId.get(message.userId);

    if (!profile) {
      throw new AppError(
        500,
        "MESSAGE_SENDER_PROFILE_MISSING",
        "A message sender profile could not be resolved.",
      );
    }

    return toSavedMessage({ message, profile, currentUserId: userId });
  });
}

async function createMessage({
  userId,
  tripId,
  body,
}: {
  userId: string;
  tripId: string;
  body: PostMessageBody;
}): Promise<SavedMessage> {
  // rule: only the authenticated user and the member of the trip can post messages

  // 1: check if the user is the memeber of this trip
  const membership = await prisma.tripMember.findUnique({
    where: { tripId_userId: { userId, tripId } },
    select: { id: true },
  });

  if (!membership) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

  // front end needs user's profile
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { userId: true, displayName: true, image: true },
  });

  if (!profile) {
    throw new AppError(
      409,
      "PROFILE_REQUIRED",
      "A profile is required before sending messages.",
    );
  }

  const createdMessage = await prisma.message.create({
    data: {
      userId: userId,
      tripId: tripId,
      content: body.content,
      clientMessageId: body.clientMessageId,
    },
    select: messageSelect,
  });

  return toSavedMessage({
    message: createdMessage,
    profile,
    currentUserId: userId,
  });
}

export { getMessages, createMessage };
