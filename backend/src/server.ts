import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import router from "./routes/tripRoom.route";
import overviewRouter from "./routes/overview.route";
import userRouter from "./routes/user.route";
import itineraryrouter from "./routes/itinerary.service";
dotenv.config();

const app = express();
const PORT = Number(process.env.BACKEND_PORT ?? 4000);
app.use(express.json());

app.use("/api/trips", router);
app.use("/api/trip", overviewRouter);
app.use("/api/itineray", itineraryrouter);

app.use("/api/user", userRouter);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is working" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Invalid Page" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
