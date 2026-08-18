import { NextFunction, Request, Response } from "express";
import {
  createRoom,
  deleteRoom,
  getMyRooms,
  joinTrip,
  updateMyTrips,
} from "../../models/tripRoom.service";
import {
  createTripBodySchema,
  joinTripBodySchema,
  tripIdParamsSchema,
  updateTripBodySchema,
} from "../../schemas/trips.schema";
import { AppError } from "../../lib/appError";

async function getMyRoomsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.userId) {
    next(
      new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authentication is required.",
      ),
    );
    return;
  }

  const trips = await getMyRooms(req.userId);

  return res.status(200).json({ data: { trips } });
}

async function createMyTripsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.userId) {
    next(
      new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authentication is required.",
      ),
    );
    return;
  }

  // validation
  const validationResult = createTripBodySchema.safeParse(req.body);

  if (!validationResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validationResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const { title, description } = validationResult.data;

  const createdTrip = await createRoom({
    userId: req.userId,
    title: title,
    description: description ?? null,
  });

  console.log("successfully created", createdTrip.id);

  return res.status(201).json({ data: { createdTrip } });
}

async function updateMyTripsController(
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

  const { id } = req.params;

  if (!id) {
    return next(new AppError(400, "TRIPID_REQUIRED", "trip id is required."));
  }

  const validationResult = updateTripBodySchema.safeParse(req.body);

  if (!validationResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validationResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const { title, description, destination, startTime, endTime } =
    validationResult.data;

  const tripId = Array.isArray(id) ? id[0] : id;

  const result = await updateMyTrips({
    id: tripId,
    userId,
    title,
    description: description,
    destination: destination,
    startTime: startTime,
    endTime: endTime,
  });

  return res.status(200).json({ data: { updatedTrip: result } });
}

async function deleteTripController(
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
  const validationResult = tripIdParamsSchema.safeParse(req.params);

  if (!validationResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validationResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const result = await deleteRoom({
    userId,
    tripId: validationResult.data.tripId,
  });

  return res.status(200).json({ data: result });
}

async function joinTripController(
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

  const validationResult = joinTripBodySchema.safeParse(req.body);

  if (!validationResult.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validationResult.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  try {
    const result = await joinTrip({
      inviteCode: validationResult.data.inviteCode,
      userId,
    });

    return res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
}

export {
  getMyRoomsController,
  createMyTripsController,
  updateMyTripsController,
  deleteTripController,
  joinTripController,
};
