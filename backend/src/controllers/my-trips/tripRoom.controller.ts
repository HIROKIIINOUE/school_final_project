import { NextFunction, Request, Response } from "express";
import { createRoom, getMyRooms } from "../../services/tripRoom.service";
import { createTripBodySchema } from "../../schemas/trips.schema";
import { AppError } from "../../utils/appError";

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
  // if (!req.userId) {
  //   if (!req.userId) {
  //     next(
  //       new AppError(
  //         401,
  //         "AUTHENTICATION_REQUIRED",
  //         "Authentication is required.",
  //       ),
  //     );
  //     return;
  //   }
  // }
  // validation
  // const validationResult = createTripBodySchema.safeParse(req.body);

  // if (!validationResult.success) {
  //   return next(
  //     new AppError(
  //       400,
  //       "VALIDATION_ERROR",
  //       "Request validation failed.",
  //       validationResult.error.issues.map((issue) => ({
  //         path: issue.path.join("."),
  //         code: issue.code,
  //         message: issue.message,
  //       })),
  //     ),
  //   );
  // }

  // const { title, description } = validationResult.data;

  const createdTrip = await createRoom({
    userId: "test-123",
    title: req.body.title,
    description: req.body.description ?? null,
  });

  return res.status(201).json({ data: { createdTrip } });
}

export { getMyRoomsController, createMyTripsController };
