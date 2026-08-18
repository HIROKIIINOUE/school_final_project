import { Router } from "express";
import {
  createExpenseController,
  deleteExpenseController,
  getExpenseController,
  getExpenseTripMembersController,
  getExpensesController,
  getExpenseSplitsController,
  updateExpenseController,
} from "../controllers/my-trips/expense.controller";
import { authCheck } from "../middleware/auth.middleware";

const expenseRouter = Router();

expenseRouter.get("/:tripId", authCheck, getExpensesController);
expenseRouter.post("/:tripId", authCheck, createExpenseController);
expenseRouter.get(
  "/:tripId/members",
  authCheck,
  getExpenseTripMembersController,
);
expenseRouter.get("/:tripId/:expenseId", authCheck, getExpenseController);
expenseRouter.put("/:tripId/:expenseId", authCheck, updateExpenseController);
expenseRouter.delete("/:tripId/:expenseId", authCheck, deleteExpenseController);

expenseRouter.get(
  "/:tripId/:expenseId/splits",
  authCheck,
  getExpenseSplitsController,
);

export default expenseRouter;
