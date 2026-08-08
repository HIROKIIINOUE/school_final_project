import { QueryClient } from "@tanstack/react-query";
import { SavedMessage } from "../types/types";
import { chatQueryKey } from "./chatQueryKeys";

export function addMsgToChatCache({
  tripId,
  newMessage,
  queryClient,
}: {
  tripId: string;
  newMessage: SavedMessage;
  queryClient: QueryClient;
}) {
  queryClient.setQueryData<SavedMessage[]>(
    chatQueryKey.byTrip(tripId),
    (oldMessages) => {
      if (!oldMessages) {
        return [newMessage];
      }

      const alreadyExistMsg = oldMessages.some(
        (msg) => msg.id === newMessage.id,
      );

      if (alreadyExistMsg) {
        return oldMessages;
      }

      return [...oldMessages, newMessage];
    },
  );
}
