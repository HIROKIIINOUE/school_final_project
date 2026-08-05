import { AppError } from "../lib/appError";
import { SendMessageResult } from "../types/chat.types";

type SendMessageFailure = Extract<SendMessageResult, { ok: false }>;
// unified error message for frontend to receive
export function toSendMessageFailure(error: unknown): SendMessageFailure {
  if (error instanceof AppError) {
    switch (error.code) {
      case "VALIDATION_ERROR":
      case "TRIP_ACCESS_DENIED":
      case "PROFILE_REQUIRED":
      case "IDEMPOTENCY_CONFLICT":
        return {
          ok: false,
          error: { code: error.code, message: error.message },
        };
    }
  }

  console.error("unexpected message:send failure: ", error);

  return {
    ok: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to send the message",
    },
  };
}
