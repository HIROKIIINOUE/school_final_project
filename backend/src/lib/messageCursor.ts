import { messageCursorSchema } from "../schemas/trips.schema";
import { AppError } from "./appError";

export type MessageCursor = { createdAt: string; id: string };
type MessageRecord = {
  id: string;
  tripId: string;
  userId: string;
  content: string;
  clientMessageId: string;
  createdAt: Date;
};

export function encodeCursor(message: Pick<MessageRecord, "createdAt" | "id">) {
  const cursor: MessageCursor = {
    createdAt: message.createdAt.toISOString(),
    id: message.id,
  };

  const encodedCursor = Buffer.from(JSON.stringify(cursor), "utf-8").toString(
    "base64url",
  );

  return encodedCursor;
}

export function decodeCursor(encodedCursor: string): MessageCursor {
  let parsed: unknown;
  try {
    const decoded = Buffer.from(encodedCursor, "base64url").toString("utf8");
    parsed = JSON.parse(decoded);
  } catch (e) {
    throw new AppError(
      400,
      "INVALID_MESSAGE_CURSOR",
      "The message cursor is invalid.",
    );
  }

  const validationResult = messageCursorSchema.safeParse(parsed);

  if (!validationResult.success) {
    throw new AppError(
      400,
      "INVALID_MESSAGE_CURSOR",
      "The message cursor is invalid.",
    );
  }

  return validationResult.data;
}
