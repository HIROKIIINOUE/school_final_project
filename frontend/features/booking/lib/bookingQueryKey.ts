export const bookingQueryKeys = {
  all: ["bookings"] as const,
  byTrip: (tripId: string) => [...bookingQueryKeys.all, tripId] as const,
};
