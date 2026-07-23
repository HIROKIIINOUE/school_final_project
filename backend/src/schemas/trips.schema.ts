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

export const itineraryItemSchema = z.object({
  title: z
    .string({ error: "Title must be a string." })
    .trim()
    .min(1, { error: "Title is required." })
    .max(100, { error: "Title must be 100 characters or fewer." }),

  detail: z.string().trim().max(200).optional(),
  location: z
    .string({ error: "Location must be a string" })
    .trim()
    .max(300)
    .optional(),
  startTime: z.iso.datetime(),
});

// The input must be an array, and every element inside the array must pass itineraryItemSchema.
export const createItinerariesBodySchema = z.object({
  itineraries: z
    .array(itineraryItemSchema)
    .min(1, "At least one itinerary item is required.")
    .max(20, "You can create at most 20 itinerary items at once."),
});

export type ItineraryItemInput = z.infer<typeof itineraryItemSchema>;

export type CreateItinerariesBody = z.infer<typeof createItinerariesBodySchema>;
