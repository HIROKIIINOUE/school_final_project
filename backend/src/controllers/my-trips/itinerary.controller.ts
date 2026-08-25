import { NextFunction, Request, Response } from "express";
import { AppError } from "../../lib/appError";
import {
  createItineraryBasedOnBooking,
  createItineraryItem,
  deleteItineraryItem,
  getItinerary,
  updateItineraryItem,
} from "../../models/itinerary.service";
import {
  itineraryItemParamsSchema,
  itineraryItemSchema,
  itineraryVersionSchema,
  tripIdParamsSchema,
} from "../../schemas/trips.schema";

function getRequiredUserId(req: Request, next: NextFunction) {
  if (req.userId) return req.userId;

  next(
    new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required."),
  );
  return null;
}

function validationDetails(
  issues: Array<{ path: PropertyKey[]; code: string; message: string }>,
) {
  return issues.map((issue) => ({
    path: issue.path.join("."),
    code: issue.code,
    message: issue.message,
  }));
}

function getExpectedUpdatedAt(req: Request, next: NextFunction) {
  const ifMatchHeader = req.headers["if-match"];

  if (!ifMatchHeader || Array.isArray(ifMatchHeader)) {
    next(
      new AppError(
        428,
        "PRECONDITION_REQUIRED",
        "If-Match is required when changing an itinerary item.",
      ),
    );
    return null;
  }

  const normalizedVersion = ifMatchHeader.trim().replace(/^"|"$/g, "");
  const result = itineraryVersionSchema.safeParse(normalizedVersion);

  if (!result.success) {
    next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "The itinerary item version is invalid.",
        validationDetails(result.error.issues),
      ),
    );
    return null;
  }

  return result.data;
}

async function getItinerariesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getRequiredUserId(req, next);
  if (!userId) return;

  const paramsResult = tripIdParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Invalid trip ID.",
        validationDetails(paramsResult.error.issues),
      ),
    );
  }

  const data = await getItinerary({ tripId: paramsResult.data.tripId, userId });

  return res.status(200).json({ data });
}

async function createItineraryItemController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getRequiredUserId(req, next);
  if (!userId) return;

  const paramsResult = tripIdParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Invalid trip ID.",
        validationDetails(paramsResult.error.issues),
      ),
    );
  }

  const bodyResult = itineraryItemSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validationDetails(bodyResult.error.issues),
      ),
    );
  }

  const data = await createItineraryItem({
    tripId: paramsResult.data.tripId,
    userId,
    input: bodyResult.data,
  });

  res.setHeader("ETag", `"${data.updatedAt.toISOString()}"`);
  return res.status(201).json({ data });
}

async function updateItineraryItemController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getRequiredUserId(req, next);
  if (!userId) return;

  const paramsResult = itineraryItemParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Invalid itinerary route parameters.",
        validationDetails(paramsResult.error.issues),
      ),
    );
  }

  const bodyResult = itineraryItemSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validationDetails(bodyResult.error.issues),
      ),
    );
  }

  const expectedUpdatedAt = getExpectedUpdatedAt(req, next);
  if (!expectedUpdatedAt) return;

  const data = await updateItineraryItem({
    ...paramsResult.data,
    userId,
    expectedUpdatedAt,
    input: bodyResult.data,
  });

  res.setHeader("ETag", `"${data.updatedAt.toISOString()}"`);
  return res.status(200).json({ data });
}

async function deleteItineraryItemController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getRequiredUserId(req, next);
  if (!userId) return;

  const paramsResult = itineraryItemParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Invalid itinerary route parameters.",
        validationDetails(paramsResult.error.issues),
      ),
    );
  }

  const expectedUpdatedAt = getExpectedUpdatedAt(req, next);
  if (!expectedUpdatedAt) return;

  await deleteItineraryItem({
    ...paramsResult.data,
    userId,
    expectedUpdatedAt,
  });

  return res.status(204).send();
}

async function generateItinerariesBasedOnBookingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getRequiredUserId(req, next);
  if (!userId) return;

  const paramsResult = tripIdParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Invalid trip ID.",
        validationDetails(paramsResult.error.issues),
      ),
    );
  }

  const itineraries = await createItineraryBasedOnBooking({
    userId,
    tripId: paramsResult.data.tripId,
  });

  return res.status(200).json({ data: itineraries });
}

export {
  createItineraryItemController,
  deleteItineraryItemController,
  getItinerariesController,
  updateItineraryItemController,
  generateItinerariesBasedOnBookingController,
};
