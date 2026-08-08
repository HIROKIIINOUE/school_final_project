export type MessageSender = {
  id: string;
  displayName: string;
  image: string | null;
};

export type SavedMessage = {
  id: string;
  clientMessageId: string;
  tripId: string;
  content: string;
  createdAt: string;
  sender: MessageSender;
};

export type JoinTripResult =
  | { ok: true; tripId: string }
  | {
      ok: false;
      error: {
        code:
          | "VALIDATION_ERROR"
          | "TRIP_ACCESS_DENIED"
          | "INTERNAL_SERVER_ERROR";
        message: string;
      };
    };
