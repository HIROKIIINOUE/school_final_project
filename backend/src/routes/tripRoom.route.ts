import { Router } from "express";
import {
  createMyTripsController,
  getMyRoomsController,
} from "../controllers/my-trips/tripRoom.controller";

const router = Router();

router.get("/my-trips", getMyRoomsController);
router.post("/create-room", createMyTripsController);

export default router;
