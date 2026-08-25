import { Router } from "express";
import { authCheck } from "../middleware/auth.middleware";
import {
  createItineraryItemController,
  deleteItineraryItemController,
  generateItinerariesBasedOnBookingController,
  getItinerariesController,
  updateItineraryItemController,
} from "../controllers/my-trips/itinerary.controller";

const itineraryrouter = Router();

itineraryrouter.get("/:tripId/itinerary", authCheck, getItinerariesController);
itineraryrouter.post(
  "/:tripId/itinerary/generate-from-bookings",
  authCheck,
  generateItinerariesBasedOnBookingController,
);
itineraryrouter.post(
  "/:tripId/itinerary",
  authCheck,
  createItineraryItemController,
);
itineraryrouter.patch(
  "/:tripId/itinerary/:itemId",
  authCheck,
  updateItineraryItemController,
);
itineraryrouter.delete(
  "/:tripId/itinerary/:itemId",
  authCheck,
  deleteItineraryItemController,
);

export default itineraryrouter;
