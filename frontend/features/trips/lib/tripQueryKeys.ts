export const tripQueryKey = {
  all: ["myTrips"] as const,
  byUser: (userId: string) => ["myTrips", userId] as const,
};
