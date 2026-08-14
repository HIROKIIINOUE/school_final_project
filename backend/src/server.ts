import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import router from "./routes/tripRoom.route";
import overviewRouter from "./routes/overview.route";
import userRouter from "./routes/user.route";
import itineraryrouter from "./routes/itinerary.routes";
import chatRouter from "./routes/chat.routes";
import { createServer } from "node:http";
import { createSocketServer } from "./socket/createSocketServer";
import { registerSocketHandlers } from "./socket/registerSocketHandlers";

import expenseRouter from "./routes/expense.route";
dotenv.config();

const app = express();
// this one is for underlying http
const httpServer = createServer(app);

// ############### NORMAL APP SETUP FOR REST ##################
const PORT = Number(process.env.BACKEND_PORT ?? 4000);
app.use(express.json());

app.use("/api/trips", router);
app.use("/api/trip", overviewRouter);
app.use("/api/trips", itineraryrouter);

app.use("/api/expenses", expenseRouter);

app.use("/api/user", userRouter);

app.use("/api/trips", chatRouter);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is working" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Invalid Page" });
});

app.use(errorHandler);

// ############### SOCKET IO FOR CHAT FEATURES ##################

// It is the central manager responsible for accepting connections, tracking connected clients, organizing them, and sending events.
const io = createSocketServer(httpServer);
registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
