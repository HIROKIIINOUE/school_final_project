import { Server as HttpServer } from "node:http";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../types/chat.types";
import { Server } from "socket.io";
import { verifyAccessToken } from "../lib/supabase-jws.service";
import { socketAuthSchema } from "../schemas/trips.schema";

export type ChatSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export function createSocketServer(httpServer: HttpServer): ChatSocketServer {
  const io = new Server<
    ClientToServerEvents, // events the client may send
    ServerToClientEvents, // events the server may send
    InterServerEvents, // events between Socket.IO servers,
    SocketData // trusted data attached to each socket
  >(httpServer);

  // middleware for socket connection
  io.use(async (socket, next) => {
    // it's like req.headers.authorization for http flow
    const authResult = socketAuthSchema.safeParse(socket.handshake.auth);
    if (!authResult.success) {
      next(new Error("AUTHENTICATION_REQUIRED"));
      return;
    }

    try {
      const payload = await verifyAccessToken(authResult.data.accessToken);
      if (!payload.sub) {
        next(new Error("AUTHENTICATION_REQUIRED"));
        return;
      }

      // attaching userId to socket data
      socket.data.userId = String(payload.sub);

      next();
    } catch (e) {
      console.error("Socket authentication failed", e);

      next(new Error("AUTHENTICATION_FAILED"));
    }
  });

  return io;
}
