import { id } from "zod/locales";
import { AppError } from "../lib/appError";
import { prisma } from "../lib/prisma";

async function getMessages({
  userId,
  tripId,
}: {
  userId: string;
  tripId: string;
}) {
  const membership = await prisma.tripMember.findFirst({
    where: { userId, tripId },
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
    select: { content: true, id: true, userId: true },
    orderBy: { createdAt: "desc" },
  });

  const results = messages.map((msg) => {
    return {
      id: msg.id,
      content: msg.content,
      isSender: msg.userId === userId,
    };
  });

  return results;
}

async function postMessages({
  userId,
  tripId,
  body,
}: {
  userId: string;
  tripId: string;
  body: { clientMessageId: string; content: string };
}) {
  // rule: only the authenticated user and the member of the trip can post messages

  // 1: check if the user is the memeber of this trip
  const membership = await prisma.tripMember.findFirst({
    where: { userId, tripId },
    select: { id: true },
  });

  if (!membership) {
    throw new AppError(
      403,
      "TRIP_ACCESS_DENIED",
      "You do not have access to this trip.",
    );
  }

  const createdMessage = await prisma.message.create({
    data: {
      userId: userId,
      tripId: tripId,
      content: body.content,
      clientMessageId: body.clientMessageId,
    },
  });

  return createdMessage;
}

export { getMessages, postMessages };
