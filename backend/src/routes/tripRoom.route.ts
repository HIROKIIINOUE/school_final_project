import { Router } from "express";
import {
  createMyTripsController,
  deleteTripController,
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
router.delete("/delete-trip/:tripId", authCheck, deleteTripController);

export default router;
