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

  await prisma.message.findMany({
    where: { tripId },
    select: {},
    orderBy: { createdAt: "desc" },
  });
}
