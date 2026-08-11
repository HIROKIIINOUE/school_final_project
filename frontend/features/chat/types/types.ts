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

export type SendMessageErrorCode =
  | "VALIDATION_ERROR"
  | "TRIP_ACCESS_DENIED"
  | "PROFILE_REQUIRED"
  | "INTERNAL_SERVER_ERROR"
  | "IDEMPOTENCY_CONFLICT";

export type SendMessageResult =
  | { ok: true; message: SavedMessage }
  | { ok: false; error: { code: SendMessageErrorCode; message: string } };

export type MessagePage = {
  messages: SavedMessage[];
  olderCursor: string | null;
};
