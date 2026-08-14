import { NextFunction, Request, Response } from "express";
import { AppError } from "../../lib/appError";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenseTripMembers,
  getExpenses,
  getExpenseSplits,
  updateExpense,
} from "../../models/expense.service";
import {
  createExpenseBodySchema,
  updateExpenseBodySchema,
} from "../../schemas/expenses.schema";

const getRequiredUserId = (req: Request, next: NextFunction) => {
  if (req.userId) return req.userId;
  next(
    new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required."),
  );
  return null;
};

const getParam = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

const validateBody = <T>(
  schema: {
    safeParse: (
      body: unknown,
    ) =>
      | { success: true; data: T }
      | {
          success: false;
          error: {
            issues: Array<{
              path: PropertyKey[];
              code: string;
              message: string;
            }>;
          };
        };
  },
  body: unknown,
  next: NextFunction,
) => {
  const result = schema.safeParse(body);
  if (result.success) return result.data;
  next(
    new AppError(
      400,
      "VALIDATION_ERROR",
      "Request validation failed.",
      result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        code: issue.code,
        message: issue.message,
      })),
    ),
  );
  return null;
};

const getExpensesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  if (!userId || !tripId) return;
  const data = await getExpenses({ tripId, userId });
  return res.status(200).json({ data });
};

const getExpenseTripMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  if (!userId || !tripId) return;
  const data = await getExpenseTripMembers({ tripId, userId });
  return res.status(200).json({ data });
};

const getExpenseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  if (!userId || !tripId || !expenseId) return;
  const data = await getExpense({ tripId, expenseId, userId });
  return res.status(200).json({ data });
};

const createExpenseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const input = validateBody(createExpenseBodySchema, req.body, next);
  if (!userId || !tripId || !input) return;
  const data = await createExpense({ tripId, userId, input });
  return res.status(201).json({ data });
};

const updateExpenseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  const input = validateBody(updateExpenseBodySchema, req.body, next);
  if (!userId || !tripId || !expenseId || !input) return;
  const data = await updateExpense({ tripId, expenseId, userId, input });
  return res.status(200).json({ data });
};

const deleteExpenseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  if (!userId || !tripId || !expenseId) return;
  await deleteExpense({ tripId, expenseId, userId });
  return res.status(204).send();
};

const getExpenseSplitsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  if (!userId || !tripId || !expenseId) return;
  const data = await getExpenseSplits({ tripId, expenseId, userId });
  return res.status(200).json({ data });
};

export {
  createExpenseController,
  deleteExpenseController,
  getExpenseController,
  getExpenseTripMembersController,
  getExpensesController,
  getExpenseSplitsController,
  updateExpenseController,
};
