export type ItineraryInputItem = {
  title: string;
  detail: string | null;
  location: string | null;
  startTime: Date | null;
};

export type SaveItineraryItemInput = {
  id?: string;
  title: string;
  detail?: string;
  location?: string;
  startTime: string;
};

export type SaveItineraryBody = { itineraries: SaveItineraryItemInput[] };
