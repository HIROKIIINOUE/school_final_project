import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../api/booking.api";
import { bookingQueryKeys } from "../lib/bookingQueryKey";

export function useTripBookings(tripId: string) {
  return useQuery({
    queryKey: bookingQueryKeys.byTrip(tripId),
    queryFn: () => getBookings({ tripId }),
  });
}
