import { NextFunction, Request, Response } from "express";
import { AppError } from "../../lib/appError";
import {
  createExpense,
  createExpenseSplit,
  deleteExpense,
  deleteExpenseSplit,
  getExpense,
  getExpenses,
  getExpenseSplits,
  updateExpense,
  updateExpenseSplit,
} from "../../models/expense.service";
import {
  createExpenseBodySchema,
  createExpenseSplitBodySchema,
  updateExpenseBodySchema,
  updateExpenseSplitBodySchema,
} from "../../schemas/expenses.schema";

const getRequiredUserId = (req: Request, next: NextFunction) => {
  if (req.userId) return req.userId;
  next(new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required."));
  return null;
};

const getParam = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

const getSplitId = (value: string | string[] | undefined, next: NextFunction) => {
  const splitId = Number(getParam(value));
  if (!Number.isInteger(splitId) || splitId < 1) {
    next(new AppError(400, "VALIDATION_ERROR", "Split ID must be a positive integer."));
    return null;
  }
  return splitId;
};

const validateBody = <T>(
  schema: { safeParse: (body: unknown) => { success: true; data: T } | { success: false; error: { issues: Array<{ path: PropertyKey[]; code: string; message: string }> } } },
  body: unknown,
  next: NextFunction,
) => {
  const result = schema.safeParse(body);
  if (result.success) return result.data;
  next(new AppError(400, "VALIDATION_ERROR", "Request validation failed.", result.error.issues.map((issue) => ({ path: issue.path.join("."), code: issue.code, message: issue.message }))));
  return null;
};

const getExpensesController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  if (!userId || !tripId) return;
  const data = await getExpenses({ tripId, userId });
  return res.status(200).json({ data });
};

const getExpenseController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  if (!userId || !tripId || !expenseId) return;
  const data = await getExpense({ tripId, expenseId, userId });
  return res.status(200).json({ data });
};

const createExpenseController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const input = validateBody(createExpenseBodySchema, req.body, next);
  if (!userId || !tripId || !input) return;
  const data = await createExpense({ tripId, userId, input });
  return res.status(201).json({ data });
};

const updateExpenseController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  const input = validateBody(updateExpenseBodySchema, req.body, next);
  if (!userId || !tripId || !expenseId || !input) return;
  const data = await updateExpense({ tripId, expenseId, userId, input });
  return res.status(200).json({ data });
};

const deleteExpenseController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  if (!userId || !tripId || !expenseId) return;
  await deleteExpense({ tripId, expenseId, userId });
  return res.status(204).send();
};

const getExpenseSplitsController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  if (!userId || !tripId || !expenseId) return;
  const data = await getExpenseSplits({ tripId, expenseId, userId });
  return res.status(200).json({ data });
};

const createExpenseSplitController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  const input = validateBody(createExpenseSplitBodySchema, req.body, next);
  if (!userId || !tripId || !expenseId || !input) return;
  const data = await createExpenseSplit({ tripId, expenseId, userId, input });
  return res.status(201).json({ data });
};

const updateExpenseSplitController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  const splitId = getSplitId(req.params.splitId, next);
  const input = validateBody(updateExpenseSplitBodySchema, req.body, next);
  if (!userId || !tripId || !expenseId || !splitId || !input) return;
  const data = await updateExpenseSplit({ tripId, expenseId, splitId, userId, input });
  return res.status(200).json({ data });
};

const deleteExpenseSplitController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getRequiredUserId(req, next);
  const tripId = getParam(req.params.tripId);
  const expenseId = getParam(req.params.expenseId);
  const splitId = getSplitId(req.params.splitId, next);
  if (!userId || !tripId || !expenseId || !splitId) return;
  await deleteExpenseSplit({ tripId, expenseId, splitId, userId });
  return res.status(204).send();
};

export {
  createExpenseController,
  createExpenseSplitController,
  deleteExpenseController,
  deleteExpenseSplitController,
  getExpenseController,
  getExpensesController,
  getExpenseSplitsController,
  updateExpenseController,
  updateExpenseSplitController,
};
