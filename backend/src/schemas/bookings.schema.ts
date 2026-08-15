import z from "zod";

const flightDetailsSchema = z.strictObject({
  flightNumber: z.string().trim().min(1).max(50),
});
