import { BedDouble, Plane } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddBookingButton } from "../components/BookingNavigation";
import BookingSection from "../components/BookingSection";
import Spinner from "@/components/Spinner";
import { useTripBookings } from "../hooks/useTripBookings";
import { useState } from "react";
import CreateOrUpdateBookingModal from "../components/CreateOrUpdateBookingModal";
import { Booking } from "../types/types";

type Props = { tripId: string };

type BookingModalState =
  | { mode: "create"; type: Booking["type"] }
  | { mode: "edit"; booking: Booking };

export default function BookingScreen({ tripId }: Props) {
  const { data, isError, error, isLoading } = useTripBookings(tripId);

  const [modalState, setModalState] = useState<BookingModalState | null>(null);

  function openCreateModal() {
    setModalState({ mode: "create", type: "FLIGHT" });
  }

  function openEditModal(booking: Booking) {
    setModalState({ mode: "edit", booking });
  }

  function closeModal() {
    setModalState(null);
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
            />

            <View className="w-full flex-row flex-wrap gap-md">
              <BookingSection
                bookings={hotels}
                emptyMessage="No accommodation has been added."
                icon={BedDouble}
                title="Accommodation"
                onEdit={openEditModal}
              />
            </View>
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
    </SafeAreaView>
  );
}
