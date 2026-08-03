export type CreateMessageInput = { clientMessageId: string; content: string };

export type MessageSender = {
  id: string;
  displayName: string;
  image: string | null;
};

export type SavedMessage = {
  id: string;
  clientMessageId: string | null;
  tripId: string;
  content: string;
  createdAt: string;
  sender: MessageSender;
};

// this is for socket data after attaching userId
export type SocketData = { userId: string };

export type JoinTripPayload = { tripId: string };

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

export type ClientToServerEvents = {
  "trip:join": (
    payload: JoinTripPayload,
    acknowledge: (result: JoinTripResult) => void,
  ) => void;
};

export type ServerToClientEvents = Record<string, never>;

export type InterServerEvents = Record<string, never>;
