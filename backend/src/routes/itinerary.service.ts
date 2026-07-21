import { Router } from "express";
import { authCheck } from "../middleware/auth.middleware";
import {
  createItineraryController,
  getItinerariesController,
} from "../controllers/my-trips/itinerary.controller";

const itineraryrouter = Router();

itineraryrouter.get("itineraries/:tripId", authCheck, getItinerariesController);
itineraryrouter.post("itinerary/:tripId", authCheck, createItineraryController);

export default itineraryrouter;
