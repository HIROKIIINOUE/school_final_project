import z from "zod";

export const profileInputSchema = z.object({
  displayName: z.string().trim().min(1).max(10),
  image: z.string().optional(),
});

export type ProfileInputType = z.infer<typeof profileInputSchema>;
