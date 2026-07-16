import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError";
import { getOverviewData } from "../../services/overview.service";

export async function GetOverviewController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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

  const { tripId } = req.params;
  const id = Array.isArray(tripId) ? tripId[0] : tripId;

  const data = await getOverviewData({ tripId: id, userId });
  return data;
}
