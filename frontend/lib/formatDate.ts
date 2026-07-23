export function formateDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric", // "2026"
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
