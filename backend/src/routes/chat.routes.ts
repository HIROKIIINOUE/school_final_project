import { Router } from "express";
import { authCheck } from "../middleware/auth.middleware";
import {
  getMessagesController,
  postMessageController,
} from "../controllers/my-trips/chat.controller";

const router = Router();

router.get("/:tripId/messages", authCheck, getMessagesController);
router.post("/:tripId/messages", authCheck, postMessageController);

export default router;
