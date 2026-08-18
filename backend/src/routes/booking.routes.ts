import { Router } from "express";
import {
  createBookingController,
  deleteBookingController,
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
router.delete(
  "/:tripId/bookings/:bookingId",
  authCheck,
  deleteBookingController,
);

export default router;
