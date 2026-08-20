import z from "zod";

export const flightDetailsSchema = z.strictObject({
  flightNumber: z.string().trim().min(1).max(50),
  departureAirport: z.string().trim().min(1).max(100),
  arrivalAirport: z.string().trim().min(1).max(100),
});

export const hotelDetailsSchema = z.strictObject({
  address: z.string().trim().max(200).nullable().optional(),
  roomType: z.string().trim().max(100).nullable().optional(),
  checkInInstructions: z.string().trim().max(500).nullable().optional(),
});

export const transportDetailsSchema = z.strictObject({
  transportType: z.string().trim().min(1).max(100),
  departureLocation: z.string().trim().max(200).nullable().optional(),
  arrivalLocation: z.string().trim().max(200).nullable().optional(),
});

export const createFlightBookingBodySchema = z.strictObject({
  type: z.literal("FLIGHT"),
  title: z.string().trim().min(1).max(100),
  provider: z.string().trim().min(1).max(100).nullable().optional(),
  confirmationCode: z.string().trim().max(100).nullable().optional(),
  startTime: z.iso.datetime().nullable().optional(),
  endTime: z.iso.datetime().nullable().optional(),
  note: z.string().trim().max(400).nullable().optional(),
  details: flightDetailsSchema,
});

export const createHotelBookingBodySchema = z.strictObject({
  type: z.literal("HOTEL"),
  title: z.string().trim().min(1).max(100),
  provider: z.string().trim().min(1).max(100).nullable().optional(),
  confirmationCode: z.string().trim().max(100).nullable().optional(),
  startTime: z.iso.datetime().nullable().optional(),
  endTime: z.iso.datetime().nullable().optional(),
  note: z.string().trim().max(400).nullable().optional(),
  details: hotelDetailsSchema,
});

export const createTransportBookingBodySchema = z.strictObject({
  type: z.literal("TRANSPORT"),
  title: z.string().trim().min(1).max(100),
  provider: z.string().trim().min(1).max(100).nullable().optional(),
  confirmationCode: z.string().trim().max(100).nullable().optional(),
  startTime: z.iso.datetime().nullable().optional(),
  endTime: z.iso.datetime().nullable().optional(),
  note: z.string().trim().max(400).nullable().optional(),
  details: transportDetailsSchema,
});

// you refer to "type" in each body shema and zod decides which schema to use.
// req.body.type === "FLIGHT"
// → choose createFlightBookingBodySchema
// → validate the whole object against that schema
// req.body.type === "HOTEL"
// → choose createHotelBookingBodySchema
// → validate the whole object against that schema
export const createBookingBodySchema = z.discriminatedUnion("type", [
  createFlightBookingBodySchema,
  createHotelBookingBodySchema,
  createTransportBookingBodySchema,
]);

export type CreateBookingBody = z.infer<typeof createBookingBodySchema>;

// Create a validator called bookingSubtypeSchema.
// There are valid possibilities:
// 1. FLIGHT
//    - type must equal "FLIGHT"
//    - details must be FlightDetails
// OR
// 2. HOTEL
//    - type must equal "HOTEL"
//    - details must be HotelDetails
// Use the `type` property to decide which one.
// 3. TRANSPORT
//    - type must be "TRANSPORT"
//    - details must be TransportDetails
export const bookingSubtypeSchema = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("FLIGHT"), details: flightDetailsSchema }),

  z.strictObject({ type: z.literal("HOTEL"), details: hotelDetailsSchema }),
  z.strictObject({
    type: z.literal("TRANSPORT"),
    details: transportDetailsSchema,
  }),
]);

export const updateBookingBodySchema = z
  .strictObject({
    type: z.enum(["FLIGHT", "HOTEL", "TRANSPORT"]).optional(),
    title: z.string().trim().min(1).max(100).optional(),
    provider: z.string().trim().min(1).max(100).nullable().optional(),
    confirmationCode: z.string().trim().max(100).nullable().optional(),
    startTime: z.iso.datetime().nullable().optional(),
    endTime: z.iso.datetime().nullable().optional(),
    note: z.string().trim().max(400).nullable().optional(),
    details: z.unknown().optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field must be provided.",
  });

export type UpdateBookingBody = z.infer<typeof updateBookingBodySchema>;

export const updateBookingParamsSchema = z.strictObject({
  tripId: z.uuid(),
  bookingId: z.uuid(),
});
