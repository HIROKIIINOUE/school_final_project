import { Router } from "express";
import { authCheck } from "../middleware/auth.middleware";
import {
  createItineraryController,
  getItinerariesController,
  updateItineraryController,
} from "../controllers/my-trips/itinerary.controller";

const itineraryrouter = Router();

itineraryrouter.get("/:tripId", authCheck, getItinerariesController);
itineraryrouter.post("/:tripId", authCheck, createItineraryController);
itineraryrouter.put("/:tripId", authCheck, updateItineraryController);

export default itineraryrouter;
