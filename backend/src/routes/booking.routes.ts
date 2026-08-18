import { Router } from "express";
import {
  createBookingController,
  getBookingsController,
  updateBookingController,
} from "../controllers/my-trips/booking.controller";
import { authCheck } from "../middleware/auth.middleware";

const router = Router();

router.get("/:tripId/bookings", authCheck, getBookingsController);
router.post("/:tripId/bookings", authCheck, createBookingController);
router.patch(
  "/:tripId/bookings/:bookingId",
  authCheck,
  updateBookingController,
);

export default router;
