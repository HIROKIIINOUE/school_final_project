const monthMaping: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export function calculatePeriod(start: Date, end?: Date) {
  const startDate = new Date(start);

  if (!end) {
    const month = monthMaping[startDate.getMonth() + 1];
    return `${month} ${startDate.getDate()} -`;
  }

  const endDate = new Date(end);

  if (startDate.getMonth() === endDate.getMonth()) {
    const month = monthMaping[startDate.getMonth() + 1];
    return `${month} ${startDate.getDate()} - ${endDate.getDate()}`;
  }

  const startMonth = monthMaping[startDate.getMonth() + 1];
  const endMonth = monthMaping[endDate.getMonth() + 1];

  return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
}
