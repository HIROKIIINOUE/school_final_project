import type { ItineraryType } from "../types/types";

export const mockItineraries: ItineraryType[] = [
  {
    id: "itinerary_1",
    title: "Arrival at Haneda Airport",
    location: "Haneda Airport (HND)",
    detail: "Collect luggage and take the airport train into central Tokyo.",
    startTime: new Date("2026-08-10T13:40:00+09:00"),
  },
  {
    id: "itinerary_2",
    title: "Check in at the hotel",
    location: "Shibuya, Tokyo",
    detail:
      "Drop off luggage and get settled before exploring the neighborhood.",
    startTime: new Date("2026-08-10T16:00:00+09:00"),
  },
  {
    id: "itinerary_3",
    title: "Dinner at an izakaya",
    location: "Shinjuku, Tokyo",
    detail: "Meet the group for dinner and review the next day's plans.",
    startTime: new Date("2026-08-10T19:00:00+09:00"),
  },
];
