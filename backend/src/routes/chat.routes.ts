import { Router } from "express";
import { authCheck } from "../middleware/auth.middleware";
import {
  getMessagesController,
  postMessageController,
} from "../controllers/my-trips/chat.controller";

const router = Router();

router.get("/", authCheck, getMessagesController);
router.post("/post-chat", authCheck, postMessageController);

export default router;
