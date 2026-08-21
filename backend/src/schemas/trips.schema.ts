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

export const updateTripBodySchema = z.strictObject({
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

  destination: z
    .string({ error: "Description must be a string." })
    .trim()
    .max(500, { error: "Description must be 500 characters or fewer." })
    .nullable()
    .optional(),

  startTime: z.iso.datetime().nullable().optional(),

  endTime: z.iso.datetime().nullable().optional(),
});

export const joinTripBodySchema = z.object({
  inviteCode: z
    .string()
    .trim()
    .min(1, "Invite code is required")
    .transform((code) => code.toUpperCase()),
});

export type JoinTripBody = z.infer<typeof joinTripBodySchema>;

// ########################## ITINERARY #################################
export const itineraryItemSchema = z.strictObject({
  title: z
    .string({ error: "Title must be a string." })
    .trim()
    .min(1, { error: "Title is required." })
    .max(100, { error: "Title must be 100 characters or fewer." }),

  detail: z.string().trim().max(200).optional().nullable(),
  location: z
    .string({ error: "Location must be a string" })
    .trim()
    .max(300)
    .optional()
    .nullable(),
  startTime: z.iso.datetime(),
});

export type ItineraryItemInput = z.infer<typeof itineraryItemSchema>;

export const itineraryItemParamsSchema = z.strictObject({
  tripId: z.uuid({ error: "Trip ID must be a valid UUID." }),
  itemId: z.uuid({ error: "Itinerary item ID must be a valid UUID." }),
});

export const itineraryVersionSchema = z.iso.datetime({
  error: "If-Match must contain a valid itinerary version.",
});

// ######################### CHAT MESSAGE #################################

export const postMessageBodySchema = z.strictObject({
  clientMessageId: z.uuid({ error: "Client message ID must be a valid UUID." }),
  content: z
    .string({ error: "Message content must be a string." })
    .trim()
    .min(1, { error: "Message cannot be empty." })
    .max(1000, { error: "Message must be 1000 characters or fewer." }),
});

export type PostMessageBody = z.infer<typeof postMessageBodySchema>;

// This one is for incoming access token for socket connection. It basically validates wether accessToken is string and none-empty
export const socketAuthSchema = z.strictObject({
  accessToken: z
    .string({ error: "Access token must be a string." })
    .min(1, { error: "Access token is required." }),
});

export const joinTripPayloadSchema = z.strictObject({
  tripId: z.uuid({ error: "Trip ID must be a valid UUID." }),
});

export const sendMessagePayloadSchema = postMessageBodySchema.extend({
  tripId: z.uuid({ error: "Trip ID must be a valid UUID." }),
});

export type SendMessagePayload = z.infer<typeof sendMessagePayloadSchema>;

export const tripIdParamsSchema = z.object({ tripId: z.uuid() });

export const getMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(30),

  before: z.string().min(1).optional(),
});

export const messageCursorSchema = z.strictObject({
  createdAt: z.iso.datetime(),
  id: z.uuid(),
});

export type MessageCursor = z.infer<typeof messageCursorSchema>;
