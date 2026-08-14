import assert from "node:assert/strict";
import test from "node:test";
import {
  itineraryItemParamsSchema,
  itineraryItemSchema,
  itineraryVersionSchema,
} from "./trips.schema";

const validItem = {
  title: "Dinner",
  detail: "Meet by the entrance",
  location: "Gion",
  startTime: "2026-08-20T18:30:00.000Z",
};

test("itinerary item accepts one valid activity", () => {
  const result = itineraryItemSchema.safeParse(validItem);

  assert.equal(result.success, true);
});

test("itinerary item rejects the old bulk update shape", () => {
  const result = itineraryItemSchema.safeParse({ itineraries: [validItem] });

  assert.equal(result.success, false);
});

test("itinerary item rejects client-controlled IDs", () => {
  const result = itineraryItemSchema.safeParse({
    ...validItem,
    id: "9c202b0c-0167-4c29-b99f-5eb349ad54f9",
  });

  assert.equal(result.success, false);
});

test("item-level route requires valid trip and item UUIDs", () => {
  const validResult = itineraryItemParamsSchema.safeParse({
    tripId: "532274a8-f4cb-40a1-bdb9-ac160d716026",
    itemId: "9c202b0c-0167-4c29-b99f-5eb349ad54f9",
  });
  const invalidResult = itineraryItemParamsSchema.safeParse({
    tripId: "not-a-trip-id",
    itemId: "not-an-item-id",
  });

  assert.equal(validResult.success, true);
  assert.equal(invalidResult.success, false);
});

test("itinerary version requires an ISO timestamp", () => {
  assert.equal(
    itineraryVersionSchema.safeParse("2026-08-20T18:30:00.000Z").success,
    true,
  );
  assert.equal(itineraryVersionSchema.safeParse("yesterday").success, false);
});
