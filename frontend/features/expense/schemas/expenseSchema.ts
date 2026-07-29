import z from "zod";

export const expenseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  price: z.coerce.number().positive("Enter an amount greater than zero"),
  currency: z.string().min(1).optional(), // ここ修正、検討中一旦nullable
  paidBy: z.string().min(1),
  owe_members: z.array(z.string().min(1)).min(1, "Select at least one member"),
  note: z.string().trim().optional(),
});
