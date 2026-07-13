type TripPlanningStatus = {
  status:
    | "DATES_NOT_SET"
    | "UPCOMING"
    | "STARTING_SOON"
    | "IN_PROGRESS"
    | "COMPLETED";
  daysUntilStart: number | null;
};

function getPlanningStatus({
  start,
  end,
}: {
  start: Date | null;
  end: Date | null;
}): TripPlanningStatus {
  if (!start || !end) {
    return { status: "DATES_NOT_SET", daysUntilStart: null };
  }
  const now = new Date();

  if (now > end) {
    return { status: "COMPLETED", daysUntilStart: null };
  }

  if (now >= start && now <= end) {
    return { status: "IN_PROGRESS", daysUntilStart: 0 };
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const daysUntilStart = Math.ceil(
    (start.getTime() - now.getTime()) / millisecondsPerDay,
  );

  if (daysUntilStart <= 7) {
    return { status: "STARTING_SOON", daysUntilStart };
  }

  return { status: "UPCOMING", daysUntilStart };
}
