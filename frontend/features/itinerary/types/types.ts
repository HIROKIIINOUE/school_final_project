export type SavedItineraryItem = {
  id: string;
  title: string;
  detail: string | null;
  location: string | null;
  startTime: string;
  isCreatedByCurrentUser: boolean;
};

export type SaveItineraryItemInput = {
  id?: string;
  title: string;
  detail?: string | null;
  location?: string | null;
  startTime: string;
};

export type ItineraryDraftItem = {
  clientId: string;
  id?: string;
  title: string;
  detail: string;
  location: string;
  startTime: Date;
};
