import {
  ItineraryDraftItem,
  SavedItineraryItem,
  SaveItineraryItemInput,
} from "../types/types";

export function savedItemToDraft(item: SavedItineraryItem): ItineraryDraftItem {
  return {
    clientId: item.id,
    id: item.id,
    title: item.title,
    detail: item.detail ?? "",
    location: item.location ?? "",
    startTime: new Date(item.startTime),
  };
}

export function draftToSaveInput(
  item: ItineraryDraftItem,
): SaveItineraryItemInput {
  return {
    id: item.id,
    title: item.title.trim(),
    detail: item.detail.trim() || null,
    location: item.location.trim() || null,
    startTime: item.startTime.toISOString(),
  };
}
