import * as z from "zod";

// validation for "createRoom" body
export const createTripBodySchema = z.strictObject({
  title: z
    .string({ error: "Title must be a string." })
    .trim()
    .min(1, { error: "Title is required." })
    .max(100, { error: "Title must be 100 characters or fewer." }),

  description: z
    .string({ error: "Description must be a string." })
    .trim()
    .max(500, { error: "Description must be 500 characters or fewer." })
    .nullable()
    .optional(),
});

export type CreateTripBody = z.infer<typeof createTripBodySchema>;
