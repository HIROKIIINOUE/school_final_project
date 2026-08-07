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
