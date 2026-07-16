import { Router } from "express";
import { GetOverviewController } from "../controllers/my-trips/overview.controller";

const router = Router();

// todo: requireAuth
router.get("/overview/:id", GetOverviewController);

export default router;
