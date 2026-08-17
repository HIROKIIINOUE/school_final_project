import { Router } from "express";
import {
  createBookingController,
  getBookingsController,
} from "../controllers/my-trips/booking.controller";
import { authCheck } from "../middleware/auth.middleware";

const router = Router();

router.get("/:tripId/bookings", authCheck, getBookingsController);
router.post("/:tripId/bookings", authCheck, createBookingController);

export default router;
