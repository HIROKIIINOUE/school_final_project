function getPlanningStatus({
  start,
  end,
}: {
  start: Date | null;
  end: Date | null;
}) {
  if (!start) return;
  if (!end) return;
  const now = new Date();
  const startDate = new Date(start).getDate();

  const startMs = new Date(start).getMilliseconds();
  const endMs = new Date(end).getMilliseconds();

  const timeDiff = now.getDate() - startDate;

  if (startMs < endMs && timeDiff <= 7 && timeDiff > 0) {
    return `In ${timeDiff} Days`;
  }

  if (timeDiff > 7) {
    return "Upcoming";
  }

  if (now.getMilliseconds() > startMs && now.getMilliseconds() < endMs) {
    return "In progress";
  }

  return "Completed";
}
