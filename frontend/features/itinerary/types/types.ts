export type SavedItineraryItem = {
  id: string;
  title: string;
  detail: string | null;
  location: string | null;
  startTime: string;
  updatedAt: string;
  isCreatedByCurrentUser: boolean;
};

export type SaveItineraryItemInput = {
  title: string;
  detail?: string | null;
  location?: string | null;
  startTime: string;
};
