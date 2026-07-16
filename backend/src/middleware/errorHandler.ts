import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

//
function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({
        error: {
          code: error.code,
          message: error.message,
          detail: error.details ?? "",
        },
      });

    return;
  }

  console.log("Unexpected error: ", error);

  res
    .status(500)
    .json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
      },
    });
}

export { errorHandler };
