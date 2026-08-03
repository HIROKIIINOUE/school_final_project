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
import { SocketData } from "./types/chat.types";

dotenv.config();

const app = express();
// this one is for underlying http
const httpServer = createServer(app);
// websocket
const io = new Server<
  Record<string, never>, // ClientToServerEvents,
  Record<string, never>, // ServerToClientEvents,
  Record<string, never>, // InterServerEvents,
  SocketData // SocketData
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
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
