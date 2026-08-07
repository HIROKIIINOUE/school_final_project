export const chatQueryKey = {
  all: ["tripMessages"] as const,
  byTrip: (tripId: string) => [...chatQueryKey.all, tripId] as const, // this returns ["messages", "tokyo-trip-uuid"]
};
