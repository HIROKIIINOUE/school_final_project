import { chatSocket } from "./chatSocket";

export function connectChatSocket() {
  chatSocket.connect();
}
