import { Router } from "express";
import { GetOverviewController } from "../controllers/my-trips/overview.controller";
import { authCheck } from "../middleware/auth.middleware";

const router = Router();

// todo: requireAuth
router.get("/overview/:tripId", authCheck, GetOverviewController);

export default router;
