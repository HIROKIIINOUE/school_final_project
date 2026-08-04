import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import router from "./routes/tripRoom.route";
import overviewRouter from "./routes/overview.route";
import userRouter from "./routes/user.route";
import itineraryrouter from "./routes/itinerary.routes";
import chatRouter from "./routes/chat.routes";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types/chat.types";
import {
  joinTripPayloadSchema,
  socketAuthSchema,
} from "./schemas/trips.schema";
import { verifyAccessToken } from "./lib/supabase-jws.service";
import { prisma } from "./lib/prisma";
import { getTripRoomName } from "./lib/tripRoomName";

dotenv.config();

const app = express();
// this one is for underlying http
const httpServer = createServer(app);
// It is the central manager responsible for accepting connections, tracking connected clients, organizing them, and sending events.
const io = new Server<
  ClientToServerEvents, // events the client may send
  ServerToClientEvents, // events the server may send
  InterServerEvents, // events between Socket.IO servers,
  SocketData // trusted data attached to each socket
>(httpServer);

// ############### NORMAL APP SETUP ##################
const PORT = Number(process.env.BACKEND_PORT ?? 4000);
app.use(express.json());

app.use("/api/trips", router);
app.use("/api/trip", overviewRouter);
app.use("/api/itinerary", itineraryrouter);

app.use("/api/user", userRouter);

app.use("/api/trips/:tripId/messages", chatRouter);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is working" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Invalid Page" });
});

app.use(errorHandler);

// ############### SOCKET IO FOR CHAT FEATURES ##################

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

io.on("connection", (socket) => {
  // it conceptually look like this
  //   socket = { id: "temporary-socket-id", handshake: { auth: { accessToken: "eyJhbGciOi...", }, }, data: {
  //     userId: "user-123", }, };

  // when new client connects
  console.log(`Socket connected: ${socket.id}, UserId: ${socket.data.userId}`);

  socket.on("trip:join", async (payload, acknowledge) => {
    const validationResult = joinTripPayloadSchema.safeParse(payload);

    if (!validationResult.success) {
      acknowledge({
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid trip join request",
        },
      });
      return;
    }

    const { tripId } = validationResult.data;
    const userId = socket.data.userId;

    try {
      const membership = await prisma.tripMember.findUnique({
        where: { tripId_userId: { tripId, userId } },
        select: { id: true },
      });

      if (!membership) {
        acknowledge({
          ok: false,
          error: {
            code: "TRIP_ACCESS_DENIED",
            message: "You do not have access to this trip.",
          },
        });

        return;
      }

      const roomName = getTripRoomName(tripId);

      // add this user to the room: "trip: tokyo-trip-uuid"
      await socket.join(roomName);

      acknowledge({ ok: true, tripId }); // this is what frontend recieves
    } catch (e) {
      console.error("Failed to join trip room ", e);

      acknowledge({
        ok: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to join the trip room.",
        },
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
