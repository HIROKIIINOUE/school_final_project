import { prisma } from "../lib/prisma";
import { getTripRoomName } from "../lib/tripRoomName";
import { createMessage } from "../models/chat.service";
import {
  joinTripPayloadSchema,
  sendMessagePayloadSchema,
} from "../schemas/trips.schema";
import { ChatSocketServer } from "./createSocketServer";
import { toSendMessageFailure } from "./socketError";

export function registerSocketHandlers(io: ChatSocketServer) {
  io.on("connection", (socket) => {
    // it conceptually look like this
    //   socket = { id: "temporary-socket-id", handshake: { auth: { accessToken: "eyJhbGciOi...", }, }, data: {
    //     userId: "user-123", }, };

    // when new client connects
    console.log(
      `Socket connected: ${socket.id}, UserId: ${socket.data.userId}`,
    );

    // joining the user to the trip specific room so that socket can manage chat by room
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

    // when the actual message is sent
    socket.on("message:send", async (payload, acknowledge) => {
      // 1: validate payload
      const validationResult = sendMessagePayloadSchema.safeParse(payload);
      if (!validationResult.success) {
        acknowledge({
          ok: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid message send request",
          },
        });
        return;
      }

      const { tripId, clientMessageId, content } = validationResult.data;
      const userId = socket.data.userId;

      // 2: try to create the message
      try {
        const result = await createMessage({
          userId,
          tripId,
          body: { clientMessageId, content },
        });

        // acknowledge is for the sender(socket) only.
        // frontend defines this acknowledge function and server just kind of "remotely execute" this function (calling this function)
        acknowledge({ ok: true, message: result.message });

        // to emit is for all the members in the room except to the sender
        if (result.wasCreated) {
          socket
            .to(getTripRoomName(tripId))
            .emit("message:created", result.message);
        }
      } catch (e) {
        acknowledge(toSendMessageFailure(e));
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`);
    });
  });
}
