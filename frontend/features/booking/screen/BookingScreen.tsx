import { BedDouble, Plane, BusFront, Ticket } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddBookingButton } from "../components/BookingNavigation";
import BookingSection from "../components/BookingSection";
import Spinner from "@/components/Spinner";
import { useTripBookings } from "../hooks/useTripBookings";
import { useState } from "react";
import CreateOrUpdateBookingModal from "../components/CreateOrUpdateBookingModal";
import { Booking } from "../types/types";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { deleteBooking } from "../api/booking.api";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";
import { bookingQueryKeys } from "../lib/bookingQueryKey";

type Props = { tripId: string };

type BookingModalState =
  | { mode: "create"; type: Booking["type"] }
  | { mode: "edit"; booking: Booking };

export default function BookingScreen({ tripId }: Props) {
  const queryClient = useQueryClient();

  const { data, isError, error, isLoading } = useTripBookings(tripId);

  const [modalState, setModalState] = useState<BookingModalState | null>(null);

  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  function openCreateModal() {
    setModalState({ mode: "create", type: "FLIGHT" });
  }

  function openEditModal(booking: Booking) {
    setModalState({ mode: "edit", booking });
  }

  function closeModal() {
    setModalState(null);
  }

  function closeDeleteModal() {
    setBookingToDelete(null);
  }

  function openDeleteModal(booking: Booking) {
    setBookingToDelete(booking);
  }

  async function onDeletePressed() {
    if (isDeleting) return;
    if (!bookingToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBooking({ tripId, bookingId: bookingToDelete.id });
      await queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.byTrip(tripId),
      });

      closeDeleteModal();
      Toast.show({ type: "success", text1: "Successfully deleted booking" });
    } catch (e) {
      console.error("Failed to delete the booking", e);
      Toast.show({ type: "error", text1: "Failed to delete the booking" });
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner message="Loading your bookings" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>
          {error instanceof Error ? error.message : "Failed to fetch bookings"}
        </Text>
      </SafeAreaView>
    );
  }
  const bookings = data ?? [];

  const flights = bookings.filter((booking) => booking.type === "FLIGHT");
  const hotels = bookings.filter((booking) => booking.type === "HOTEL");
  const transports = bookings.filter((booking) => booking.type === "TRANSPORT");
  const activities = bookings.filter((booking) => booking.type === "ACTIVITY");

  return (
    <SafeAreaView
      className="screen flex-1"
      edges={["left", "right", "bottom"]}
      style={{ flex: 1 }}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="mx-auto w-full max-w-[1200px] flex-grow flex-row px-container py-lg md:py-xl"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-3xl flex-1 gap-lg">
            <View className="screen-header-row mb-0 items-end">
              <View className="min-w-0 flex-1">
                <Text className="headline-xl">Bookings</Text>
                <Text className="screen-subtitle">
                  Manage your reservations and tickets.
                </Text>
              </View>
            </View>

            <BookingSection
              bookings={flights}
              emptyMessage="No flights have been added."
              icon={Plane}
              title="Flights"
              wide
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />

            <View className="w-full flex-row flex-wrap gap-md">
              <BookingSection
                bookings={hotels}
                emptyMessage="No accommodation has been added."
                icon={BedDouble}
                title="Accommodation"
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            </View>

            <BookingSection
              bookings={transports}
              emptyMessage="No transports have been added."
              icon={BusFront}
              title="Transports"
              wide
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />

            <BookingSection
              bookings={activities}
              emptyMessage="No activities have been added."
              icon={Ticket}
              title="Activities"
              wide
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          </View>
        </ScrollView>

        <AddBookingButton floating onPress={openCreateModal} />
      </View>

      {modalState && (
        <CreateOrUpdateBookingModal
          visible
          booking={modalState.mode === "edit" ? modalState.booking : null}
          type={
            modalState.mode === "edit"
              ? modalState.booking.type
              : modalState.type
          }
          onClose={closeModal}
          onTypeChange={(type) => {
            setModalState((current) => {
              if (!current || current.mode !== "create") {
                return current;
              }

              return { ...current, type };
            });
          }}
          tripId={tripId}
        />
      )}

      {bookingToDelete && (
        <DeleteConfirmationModal
          handleClose={closeDeleteModal}
          label={bookingToDelete.title}
          onPress={onDeletePressed}
          isSending={isDeleting}
          title="booking"
        />
      )}
    </SafeAreaView>
  );
}
