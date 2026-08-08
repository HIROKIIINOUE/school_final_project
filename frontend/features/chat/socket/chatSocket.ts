import { io } from "socket.io-client";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
}

export const chatSocket = io(BACKEND_URL, { autoConnect: false });
