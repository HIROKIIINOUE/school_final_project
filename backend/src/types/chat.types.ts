import { SendMessagePayload } from "../schemas/trips.schema";

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

  "message:send": (
    payload: SendMessagePayload,
    acknowledge: (result: SendMessageResult) => void,
  ) => void;
};

export type ServerToClientEvents = {
  "message:created": (message: SavedMessage) => void;
};

export type InterServerEvents = Record<string, never>;

export type SendMessageErrorCode =
  | "VALIDATION_ERROR"
  | "TRIP_ACCESS_DENIED"
  | "PROFILE_REQUIRED"
  | "INTERNAL_SERVER_ERROR"
  | "IDEMPOTENCY_CONFLICT";

export type SendMessageResult =
  | { ok: true; message: SavedMessage }
  | { ok: false; error: { code: SendMessageErrorCode; message: string } };
