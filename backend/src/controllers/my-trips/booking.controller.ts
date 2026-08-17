import { NextFunction, Request, Response } from "express";
import { AppError } from "../../lib/appError";
import { tripIdParamsSchema } from "../../schemas/trips.schema";
import { createBookingBodySchema } from "../../schemas/bookings.schema";
import { createBooking } from "../../models/booking.service";

function getRequiredUserId(req: Request, next: NextFunction) {
  if (req.userId) return req.userId;

  next(
    new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required."),
  );
  return null;
}

async function createBookingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getRequiredUserId(req, next);
  if (!userId) return;

  const tripIdValidation = tripIdParamsSchema.safeParse(req.params);
  if (!tripIdValidation.success) {
    return next(new AppError(400, "VALIDATION_ERROR", "Invalid trip ID."));
  }

  const bodyValidation = createBookingBodySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return next(new AppError(400, "VALIDATION_ERROR", "Invalid body"));
  }

  const data = await createBooking({
    userId,
    tripId: tripIdValidation.data.tripId,
    body: bodyValidation.data,
  });

  return { data };
}
