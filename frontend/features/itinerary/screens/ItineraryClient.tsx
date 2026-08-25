import { Pressable, ScrollView, Text, View } from "react-native";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import Spinner from "@/components/Spinner";
import { getDateKey } from "@/lib/formatDate";
import {
  createItineraryItem,
  deleteItineraryItem,
  fetchItineraries,
  ItineraryApiError,
  updateItineraryItem,
} from "../api/itinerary.api";
import CreateOrEditItineraryModal from "../components/CreateOrEditItineraryModal";
import IndivisualItinerary from "../components/IndivisualItinerary";
import { SavedItineraryItem, SaveItineraryItemInput } from "../types/types";

type Props = { tripId: string };

const sortChronologically = (items: SavedItineraryItem[]) =>
  [...items].sort(
    (first, second) =>
      new Date(first.startTime).getTime() -
      new Date(second.startTime).getTime(),
  );

export const ItineraryClient = ({ tripId }: Props) => {
  const [itineraryItems, setItineraryItems] = useState<SavedItineraryItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SavedItineraryItem | null>(
    null,
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SavedItineraryItem | null>(
    null,
  );
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const loadItineraries = useCallback(async () => {
    const items = await fetchItineraries(tripId);
    // array of itineraries
    const sortedItems = sortChronologically(items);
    setItineraryItems(sortedItems);
    return sortedItems;
  }, [tripId]);

  // whenever the page becomes active, fetch itineraries and set it
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        try {
          setIsLoading(true);
          const items = await fetchItineraries(tripId);
          if (isActive) setItineraryItems(sortChronologically(items));
        } catch (error) {
          if (!isActive) return;
          Toast.show({
            type: "error",
            text1:
              error instanceof Error
                ? error.message
                : "Failed to load the itinerary",
          });
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      void load();
      return () => {
        isActive = false;
      };
    }, [tripId]),
  );

  const itineraryGroups = useMemo(() => {
    const groups = new Map<string, SavedItineraryItem[]>();

    for (const item of itineraryItems) {
      const dateKey = getDateKey(new Date(item.startTime)); // Aug, 24 2026
      groups.set(dateKey, [...(groups.get(dateKey) ?? []), item]); // {"Aug, 24 2026" : [{} ... {}]}
    }

    return [...groups.values()];
  }, [itineraryItems]);

  const openCreateEditor = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (item: SavedItineraryItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  const closeDeleteModal = () => {
    if (deletingItemId) return;
    setItemToDelete(null);
  };

  const openDeleteModal = (item: SavedItineraryItem) => {
    setItemToDelete(item);
  };

  const handleSave = async (input: SaveItineraryItemInput) => {
    if (!editingItem) {
      const createdItem = await createItineraryItem({ tripId, input });
      setItineraryItems((currentItems) =>
        sortChronologically([...currentItems, createdItem]),
      );
      return;
    }

    try {
      const updatedItem = await updateItineraryItem({
        tripId,
        item: editingItem,
        input,
      });
      setItineraryItems((currentItems) =>
        sortChronologically(
          currentItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        ),
      );
      setEditingItem(updatedItem);
    } catch (error) {
      if (
        error instanceof ItineraryApiError &&
        error.code === "ITINERARY_CONFLICT"
      ) {
        const refreshedItems = await loadItineraries();
        const refreshedItem = refreshedItems.find(
          (item) => item.id === editingItem.id,
        );

        if (refreshedItem) {
          setEditingItem(refreshedItem);
        } else {
          closeEditor();
        }
      }
      throw error;
    }
  };

  const handleDelete = async () => {
    if (deletingItemId || !itemToDelete) return;

    const item = itemToDelete;
    setDeletingItemId(item.id);

    try {
      await deleteItineraryItem({ tripId, item });
      setItineraryItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.id !== item.id),
      );
      setItemToDelete(null);
      Toast.show({ type: "success", text1: "Activity deleted" });
    } catch (error) {
      if (
        error instanceof ItineraryApiError &&
        error.code === "ITINERARY_CONFLICT"
      ) {
        const refreshedItems = await loadItineraries();
        const refreshedItem = refreshedItems.find(
          (currentItem) => currentItem.id === item.id,
        );

        setItemToDelete(refreshedItem ?? null);
      }

      Toast.show({
        type: "error",
        text1:
          error instanceof Error
            ? error.message
            : "Failed to delete the activity",
      });
    } finally {
      setDeletingItemId(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <View className="flex-row items-center justify-between bg-surface px-md py-sm">
        <Text className="text-title text-primary">Itinerary Page</Text>
        <Pressable
          accessibilityLabel="Add itinerary activity"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-full bg-primary-container"
          onPress={openCreateEditor}
        >
          <Plus size={20} />
        </Pressable>
      </View>

      {itineraryItems.length === 0 ? (
        <View className="empty-state flex-1">
          <Text className="empty-title">No itinerary activities yet</Text>
          <Pressable
            accessibilityRole="button"
            className="btn-primary empty-action"
            onPress={openCreateEditor}
          >
            <Text className="btn-primary-text">Add an activity</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView className="screen" showsVerticalScrollIndicator={false}>
          {itineraryGroups.map((items) => (
            <IndivisualItinerary
              key={getDateKey(new Date(items[0].startTime))}
              deletingItemId={deletingItemId}
              itineraries={items}
              onDelete={openDeleteModal}
              onEdit={openEditEditor}
            />
          ))}
        </ScrollView>
      )}

      {isEditorOpen ? (
        <CreateOrEditItineraryModal
          closeModal={closeEditor}
          item={editingItem}
          onSubmit={handleSave}
        />
      ) : null}

      {itemToDelete ? (
        <DeleteConfirmationModal
          handleClose={closeDeleteModal}
          isSending={deletingItemId !== null}
          label={itemToDelete.title}
          onPress={handleDelete}
          title="activity"
        />
      ) : null}
    </SafeAreaView>
  );
};
