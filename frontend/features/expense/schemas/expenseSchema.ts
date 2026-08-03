import z from "zod";

export const expenseSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    price: z.coerce
      .number()
      .positive("Enter an amount greater than zero")
      .multipleOf(0.01, "Enter an amount with up to two decimal places"),
    currency: z.string().min(1).optional(), // ここ修正、検討中一旦nullable
    paidByMemberId: z.string().min(1),
    oweMemberIds: z.array(z.string()).min(1, "Select at least one member"),
    splitType: z.enum(["EQUAL", "CUSTOM"]),
    customSplits: z.record(z.string(), z.coerce.number().min(0)),
    note: z.string().trim().optional(),
  })
  .superRefine((values, context) => {
    if (values.splitType !== "CUSTOM") return;

    const customTotal = values.oweMemberIds.reduce(
      (total, memberId) => total + (values.customSplits[memberId] ?? 0),
      0,
    );

    if (Math.abs(customTotal - values.price) > 0.000001) {
      context.addIssue({
        code: "custom",
        path: ["customSplits"],
        message: "The custom split total must equal the expense amount",
      });
    }
  });
