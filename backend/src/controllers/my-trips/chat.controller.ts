import { NextFunction, Request, Response } from "express";
import { AppError } from "../../lib/appError";
import {
  postMessageBodySchema,
  tripIdParamsSchema,
} from "../../schemas/trips.schema";
import { getMessages, createMessage } from "../../models/chat.service";

async function getMessagesController(
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

  const results = await getMessages({ userId, tripId });

  return res.status(200).json({ data: results });
}

async function postMessageController(
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

  const validatedBody = postMessageBodySchema.safeParse(req.body);

  if (!validatedBody.success) {
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        validatedBody.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      ),
    );
  }

  const body = validatedBody.data;

  const result = await createMessage({ userId, tripId, body: body });

  return res.status(201).json({ data: result });
}

export { getMessagesController, postMessageController };
