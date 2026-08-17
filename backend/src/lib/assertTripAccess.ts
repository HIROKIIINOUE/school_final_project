import { AppError } from "./appError";
import { prisma } from "./prisma";

export async function assertTripAccess({
  tripId,
  userId,
}: {
  tripId: string;
  userId: string;
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
}
