import z from "zod";

export const profileInputSchema = z.object({
  displayName: z.string().min(1),
  image: z.string().optional(),
});

export type ProfileInputType = z.infer<typeof profileInputSchema>;
