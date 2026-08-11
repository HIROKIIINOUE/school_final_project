import { grabAccessToken } from "@/lib/getAccessToken";
import { io } from "socket.io-client";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

export const chatSocket = io(BACKEND_URL, {
  autoConnect: false,
  auth: async (provideAuthData) => {
    // socketIo's internal callback, which practically sends auth credentails to server
    try {
      const accessToken = await grabAccessToken();
      provideAuthData({ accessToken });
    } catch (e) {
      console.error("Failed to get access token", e);
      provideAuthData({ accessToken: "" });
    }
  },
});
