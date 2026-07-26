import { NextFunction, Request, Response } from "express";
import { AppError } from "../../lib/appError";
import {
  createItinerary,
  getItinerary,
  updateItinerary,
} from "../../models/itinerary.service";
import {
  createItinerariesBodySchema,
  tripIdParamsSchema,
  updatItinerariesBodySchema,
} from "../../schemas/trips.schema";

async function getItinerariesController(
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

  const paramsResult = tripIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Invalid trip ID.",
        paramsResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const { tripId } = paramsResult.data;

  const id = Array.isArray(tripId) ? tripId[0] : tripId;

  const data = await getItinerary({ tripId: id, userId });

  return res.status(200).json({ data });
}

async function createItineraryController(
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

  const paramsResult = tripIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Invalid trip ID.",
        paramsResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const { tripId } = paramsResult.data;

  // validation

  const validatedResult = createItinerariesBodySchema.safeParse(req.body);

  if (!validatedResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validatedResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const { itineraries } = validatedResult.data;

  const data = await createItinerary({
    tripId: Array.isArray(tripId) ? tripId[0] : tripId,
    userId,
    itineraries: itineraries,
  });

  return res.status(201).json({ data });
}

async function updateItineraryController(
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

  const paramsResult = tripIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Invalid trip ID.",
        paramsResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const { tripId } = paramsResult.data;

  // validate body
  const validatedResult = updatItinerariesBodySchema.safeParse(req.body);
  if (!validatedResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validatedResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const data = await updateItinerary({
    tripId: Array.isArray(tripId) ? tripId[0] : tripId,
    userId,
    itineraries: validatedResult.data.itineraries,
  });
  return res.status(200).json({ data });
}

export {
  getItinerariesController,
  createItineraryController,
  updateItineraryController,
};
