import { NextFunction, Response } from "express";
import { createRoom, getMyRooms } from "../../services/tripRoom.service";
import { AuthedRequest } from "../../types/types";
import { createTripBodySchema } from "../../schemas/trips.schema";
import { AppError } from "../../utils/appError";

type CreateRoomBody = { title: string; description?: string };

async function getMyRoomsController(req: AuthedRequest, res: Response) {
  const trips = await getMyRooms(req.userId);

  return res.status(200).json({ data: { trips } });
}

async function createMyTripsController(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
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

  return res.status(201).json({ data: { createdTrip } });
}

export { getMyRoomsController, createMyTripsController };
