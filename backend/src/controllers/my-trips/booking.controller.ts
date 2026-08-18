import { NextFunction, Request, Response } from "express";
import { AppError } from "../../lib/appError";
import { tripIdParamsSchema } from "../../schemas/trips.schema";
import {
  createBookingBodySchema,
  updateBookingBodySchema,
  updateBookingParamsSchema,
} from "../../schemas/bookings.schema";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
} from "../../models/booking.service";

function getRequiredUserId(req: Request, next: NextFunction) {
  if (req.userId) return req.userId;

  next(
    new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required."),
  );
  return null;
}

async function getBookingsController(
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

  const bookings = await getBookings({
    userId,
    tripId: tripIdValidation.data.tripId,
  });
  return res.status(200).json({ data: { bookings } });
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

  return res.status(201).json({ data: { booking: data } });
}

async function updateBookingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getRequiredUserId(req, next);
  if (!userId) return;

  const paramsValidation = updateBookingParamsSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    return next(
      new AppError(400, "VALIDATION_ERROR", "Invalid trip ID or booking ID."),
    );
  }

  const tripId = paramsValidation.data.tripId;
  const bookingId = paramsValidation.data.bookingId;

  const bodyValidation = updateBookingBodySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return next(new AppError(400, "VALIDATION_ERROR", "Invalid body"));
  }

  const result = await updateBooking({
    userId,
    tripId,
    bookingId,
    body: bodyValidation.data,
  });

  return res.status(200).json({ data: { updatedBooking: result } });
}

async function deleteBookingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getRequiredUserId(req, next);
  if (!userId) return;

  const paramsValidation = updateBookingParamsSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    return next(
      new AppError(400, "VALIDATION_ERROR", "Invalid trip ID or booking ID."),
    );
  }

  const tripId = paramsValidation.data.tripId;
  const bookingId = paramsValidation.data.bookingId;

  const result = await deleteBooking({ userId, tripId, bookingId });

  return res.status(200).json({ data: { deletedBooking: result } });
}

export {
  getBookingsController,
  createBookingController,
  updateBookingController,
  deleteBookingController,
};
