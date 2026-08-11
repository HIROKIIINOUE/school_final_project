import { Router } from "express";
import {
  createMyTripsController,
  getMyRoomsController,
  joinTripController,
  updateMyTripsController,
} from "../controllers/my-trips/tripRoom.controller";
import { authCheck } from "../middleware/auth.middleware";

const router = Router();

router.get("/my-trips", authCheck, getMyRoomsController);
router.post("/create-trip", authCheck, createMyTripsController);
router.post("/join", authCheck, joinTripController);
router.put("/update-trip/:id", authCheck, updateMyTripsController);

export default router;
