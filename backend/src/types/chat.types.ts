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
  isSentByCurrentUser: boolean;
};

// this is for socket data after attaching userId
export type SocketData = { userId: string };
