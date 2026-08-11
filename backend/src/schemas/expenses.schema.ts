import * as z from "zod";

const moneySchema = z.coerce
  .number()
  .finite("Amount must be a finite number.")
  .nonnegative("Amount must be zero or greater.")
  .multipleOf(0.01, "Amount must have up to two decimal places.");

const expenseSplitSchema = z.strictObject({
  tripMemberId: z.uuid("Trip member ID must be a valid UUID."),
  owedAmount: moneySchema,
});

export const createExpenseBodySchema = z.strictObject({
  title: z.string().trim().min(1).max(40),
  price: moneySchema.positive("Price must be greater than zero."),
  currency: z.string().trim().min(1).max(10).nullable().optional(),
  paidByMemberId: z.uuid("Paid-by member ID must be a valid UUID."),
  splitType: z.enum(["EQUAL", "CUSTOM"]),
  note: z.string().trim().max(500).nullable().optional(),
  splits: z.array(expenseSplitSchema).min(1),
});

export const updateExpenseBodySchema = createExpenseBodySchema;

export const createExpenseSplitBodySchema = z.strictObject({
  tripMemberId: z.uuid("Trip member ID must be a valid UUID."),
  owedAmount: moneySchema,
});

export const updateExpenseSplitBodySchema = z.strictObject({
  owedAmount: moneySchema,
});

export type ExpenseInput = z.infer<typeof createExpenseBodySchema>;
export type ExpenseSplitInput = z.infer<typeof createExpenseSplitBodySchema>;
export type ExpenseSplitUpdateInput = z.infer<
  typeof updateExpenseSplitBodySchema
>;
