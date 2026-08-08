import { grabAccessToken } from "@/lib/getAccessToken";
import { chatSocket } from "./chatSocket";

export async function connectChatSocket() {
  const accessToken = await grabAccessToken();
  chatSocket.auth = { accessToken };

  chatSocket.connect();
}
