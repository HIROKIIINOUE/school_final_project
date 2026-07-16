export function formateDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { month: "narrow" }).format(date);
}
