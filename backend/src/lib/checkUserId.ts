import { NextFunction, Request } from "express";
import { AppError } from "./appError";

export function checkUserId(req: Request, next: NextFunction) {
  const userId = req.userId;

  if (!userId) {
    next(
      new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authentication is required.",
      ),
    );
    return;
  }

  return userId;
}
