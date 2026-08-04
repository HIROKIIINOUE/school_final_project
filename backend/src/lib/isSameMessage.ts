import { PostMessageBody } from "../schemas/trips.schema";

export function isSameMessageCommand({
  existingMessage,
  tripId,
  body,
}: {
  existingMessage: { tripId: string; content: string };
  tripId: string;
  body: PostMessageBody;
}): boolean {
  return (
    existingMessage.tripId === tripId &&
    existingMessage.content === body.content
  );
}
