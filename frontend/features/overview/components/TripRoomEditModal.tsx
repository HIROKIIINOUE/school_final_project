import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { CalendarDays, Clock, MapPin, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/config/toastConfig";
import { TripDetailsType, TripRoomFormType } from "../types/types";
import { UpdateMyRoomInput } from "@/features/trips/types/types";
import { updateMyTrips } from "@/features/trips/api/myRoom.api";

type Props = {
  trip: TripDetailsType;
  closeModal: () => void;
  onTripUpdate: () => void;
};

export default function TripRoomEditModal({
  trip,
  closeModal,
  onTripUpdate,
}: Props) {
  const [tripInputs, settripInputs] = useState<TripRoomFormType>({
    title: "",
    description: "",
    destination: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedStartDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(tripInputs.startDate);

  const formattedEndDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(tripInputs.endDate);

  async function onSubmit(input: UpdateMyRoomInput) {
    await updateMyTrips(input);
  }

  async function handleSave() {
    const title = tripInputs.title.trim();

    if (!title) {
      Toast.show({ type: "error", text1: "Activity title is required" });
      return;
    }

    const sendingData = {
      title,
      tripId: trip.id,
      description: tripInputs.description ?? null,
      destination: tripInputs.destination ?? null,
      startTime: tripInputs.startDate ?? null,
      endTime: tripInputs.endDate ?? null,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(sendingData);
      Toast.show({ type: "success", text1: "Trip updated" });
      closeModal();
      await onTripUpdate();
    } catch (error) {
      Toast.show({
        type: "error",
        text1:
          error instanceof Error
            ? error.message
            : "Unable to save this activity",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    function setField() {
      const existingStartTime = trip.startDate
        ? new Date(trip.startDate)
        : new Date();
      const existingEndTime = trip.endDate
        ? new Date(trip.endDate)
        : new Date();
      settripInputs({
        title: trip.title,
        description: trip.description ?? "",
        destination: trip.destination ?? "",
        startDate: existingStartTime,
        endDate: existingEndTime,
      });
    }

    setField();
  }, [trip]);

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => {
        if (!isSubmitting) closeModal();
      }}
    >
      <View className="flex-1 justify-end">
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable
          style={StyleSheet.absoluteFill}
          className="bg-black/40"
          onPress={() => {
            if (!isSubmitting) closeModal();
          }}
        />
        <View className="h-[90%] w-full overflow-hidden rounded-t-3xl bg-surface">
          <View className="max-h-[90%] w-full overflow-hidden rounded-t-3xl bg-surface">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-outline-variant bg-surface px-container-margin py-md px-sm">
              <Pressable
                className="h-11 w-11 items-start justify-center"
                accessibilityLabel="Close activity editor"
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={closeModal}
              >
                <X size={28} className="text-on-surface-variant" />
              </Pressable>

              <Text className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
                Edit trip
              </Text>

              <Pressable
                className="rounded-full bg-secondary-container px-md py-sm"
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={handleSave}
              >
                <Text className="text-label-md font-label-md text-primary">
                  {isSubmitting ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>

            <ScrollView
              className="px-container-margin"
              contentContainerClassName="pb-12 pt-md"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={
                Platform.OS === "ios" ? "interactive" : "on-drag"
              }
            >
              <View className="mb-lg items-center">
                <Text className="text-center font-body-md italic text-on-surface-variant">
                  Plan the next activity with your trip members
                </Text>
              </View>

              <View className="gap-lg rounded-3xl border border-outline-variant bg-surface-container-lowest p-lg">
                {/* Activity title */}
                <View className="gap-xs">
                  <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
                    Trip Title
                  </Text>

                  <TextInput
                    placeholder="e.g., Team Dinner at Gonpachi"
                    className="h-12 rounded-xl border border-outline-variant bg-surface-container px-md text-body-lg
               text-on-surface"
                    onChangeText={(title) => {
                      settripInputs((prev) => ({ ...prev, title: title }));
                    }}
                    maxLength={100}
                    value={tripInputs.title}
                  />
                </View>

                {/* description */}
                <View className="gap-xs">
                  <View className="flex flex-row items-center">
                    <MapPin
                      size={21}
                      className="absolute left-md z-10 text-on-surface-variant"
                    />
                    <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
                      Description
                    </Text>
                  </View>

                  <View className="relative  items-center">
                    <TextInput
                      placeholder="Nishi-Azabu, Tokyo"
                      className="h-12 rounded-xl border border-outline-variant bg-surface-container pl-12 pr-md text-body-lg text-on-surface w-full"
                      onChangeText={(description) =>
                        settripInputs((prev) => ({ ...prev, description }))
                      }
                      maxLength={300}
                      value={tripInputs.description}
                    />
                  </View>
                </View>

                {/* destination */}
                <View className="gap-xs">
                  <View className="flex flex-row items-center">
                    <MapPin
                      size={21}
                      className="absolute left-md z-10 text-on-surface-variant"
                    />
                    <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
                      Destination
                    </Text>
                  </View>

                  <View className="relative  items-center">
                    <TextInput
                      placeholder="Nishi-Azabu, Tokyo"
                      className="h-12 rounded-xl border border-outline-variant bg-surface-container pl-12 pr-md text-body-lg text-on-surface w-full"
                      onChangeText={(destination) =>
                        settripInputs((prev) => ({ ...prev, destination }))
                      }
                      maxLength={300}
                      value={tripInputs.destination}
                    />
                  </View>
                </View>

                {/* Date */}
                <View className="gap-xs">
                  <View className="flex flex-row items-center">
                    <CalendarDays
                      size={21}
                      className="absolute left-md z-10 text-on-surface-variant"
                    />
                    <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
                      Start Date
                    </Text>
                  </View>

                  <Pressable onPress={() => setShowStartDatePicker(true)}>
                    <TextInput
                      value={formattedStartDate}
                      editable={false}
                      pointerEvents="none"
                      placeholder="Select date"
                      className="h-12 rounded-xl border px-4"
                    />
                  </Pressable>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={tripInputs.startDate}
                      mode="date"
                      onChange={(_, selectedDate) => {
                        if (Platform.OS === "android") {
                          setShowStartDatePicker(false);
                        }

                        if (selectedDate) {
                          settripInputs((prev) => ({
                            ...prev,
                            startDate: selectedDate,
                          }));
                        }
                      }}
                    />
                  )}
                </View>

                {/* End Date */}
                <View className="gap-xs">
                  <View className="flex flex-row items-center">
                    <CalendarDays
                      size={21}
                      className="absolute left-md z-10 text-on-surface-variant"
                    />
                    <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
                      End Date
                    </Text>
                  </View>

                  <Pressable onPress={() => setShowEndDatePicker(true)}>
                    <TextInput
                      value={formattedEndDate}
                      editable={false}
                      pointerEvents="none"
                      placeholder="Select date"
                      className="h-12 rounded-xl border px-4"
                    />
                  </Pressable>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={tripInputs.endDate}
                      mode="date"
                      onChange={(_, selectedDate) => {
                        if (Platform.OS === "android") {
                          setShowEndDatePicker(false);
                        }

                        if (selectedDate) {
                          settripInputs((prev) => ({
                            ...prev,
                            endDate: selectedDate,
                          }));
                        }
                      }}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
}
