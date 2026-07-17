import { Router } from "express";
import {
  createMyTripsController,
  getMyRoomsController,
} from "../controllers/my-trips/tripRoom.controller";
import { authCheck } from "../middleware/auth.middleware";

const router = Router();

router.get("/my-trips", authCheck, getMyRoomsController);
router.post("/create-trip", authCheck, createMyTripsController);

export default router;
