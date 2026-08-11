import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { MessagePage, SavedMessage } from "../types/types";
import { chatQueryKey } from "./chatQueryKeys";

// this is when created message is returned
export function addMsgToChatCache({
  tripId,
  newMessage,
  queryClient,
}: {
  tripId: string;
  newMessage: SavedMessage;
  queryClient: QueryClient;
}) {
  queryClient.setQueryData<InfiniteData<MessagePage, string | null>>(
    chatQueryKey.byTrip(tripId),
    (oldData) => {
      if (!oldData) {
        return oldData;
      }

      const alreadyExistMsg = oldData.pages.some((page) =>
        page.messages.some((msg) => msg.id === newMessage.id),
      );

      if (alreadyExistMsg) {
        return oldData;
      }

      const latestPage = oldData.pages[0];
      if (!latestPage) {
        return oldData;
      }
      // adding the new message to the first page of cached message
      const updatedLatestPage = {
        ...latestPage,
        messages: [...latestPage.messages, newMessage],
      };

      // this becomes like : [{msg8, msg9, msg10}, {msg5, msg6, msg7} ...]
      const updatedPages = [updatedLatestPage, ...oldData.pages.slice(1)];

      // you need to return {pages: [], pagesParam: []}
      return { ...oldData, pages: updatedPages };
    },
  );
}
