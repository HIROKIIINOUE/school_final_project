import { Router } from "express";
import { GetOverviewController } from "../controllers/my-trips/overview.controller";

const router = Router();

// todo: requireAuth
router.get("/overview/:tripId", GetOverviewController);

export default router;
