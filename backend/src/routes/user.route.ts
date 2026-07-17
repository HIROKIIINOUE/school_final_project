import { Router } from "express";
import userController from "../controllers/auth/user.controller";
import { authCheck } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/profile", authCheck, userController.checkProfileExist);
userRouter.post("/profile/create", authCheck, userController.createProfile);

export default userRouter;
