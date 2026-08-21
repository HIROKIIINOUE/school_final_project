import { BlurView } from "expo-blur";
import {
  BedDouble,
  BusFront,
  CalendarDays,
  Plane,
  Ticket,
  X,
} from "lucide-react-native";
import { styled } from "nativewind";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ActivityDetailsType,
  CreateBookingBody,
  HotelDetailsType,
  TransportDetailsType,
  UpdateBookingBody,
  type Booking,
  type FlightDetailsType,
} from "../types/types";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createBooking, updateBooking } from "../api/booking.api";
import { useQueryClient } from "@tanstack/react-query";
import { bookingQueryKeys } from "../lib/bookingQueryKey";
import Toast from "react-native-toast-message";
import MiniSpinner from "@/components/MiniSpinner";

const StyledSafeAreaView = styled(SafeAreaView);

type BookingType = Booking["type"];

type CreateOrUpdateBookingModalProps = {
  visible: boolean;
  type: BookingType;
  booking?: Booking | null;
  onClose?: () => void;
  onTypeChange?: (type: BookingType) => void;
  tripId: string;
};

type InputFieldProps = {
  label: string;
  multiline?: boolean;
  placeholder: string;
  value: string;
  onTextChange: (value: string) => void;
};

type BaseBookingInfo = {
  title: string;
  provider?: string | null;
  confirmationCode?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  note?: string | null;
};

// input field
function InputField({
  label,
  multiline = false,
  placeholder,
  value,
  onTextChange,
}: InputFieldProps) {
  return (
    <View className="form-group">
      <Text className="label">{label}</Text>
      <TextInput
        className={multiline ? "textarea" : "input"}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#6d7979"
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
        onChangeText={(value) => onTextChange(value)}
      />
    </View>
  );
}
// date time field
function DateTimeField({
  label,
  formattedDate,
  placeholder,
  visible,
  value,
  setShowDatePicker,
  setInput,
}: {
  label: string;
  formattedDate: string;
  placeholder: string;
  visible: boolean;
  value: Date;
  setShowDatePicker: (value: boolean) => void;
  setInput: (input: Date) => void;
}) {
  return (
    <View className="gap-xs">
      <View className="flex flex-row items-center">
        <CalendarDays
          size={21}
          className="absolute left-md z-10 text-on-surface-variant"
        />
        <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
          {label}
        </Text>
      </View>

      <Pressable onPress={() => setShowDatePicker(true)}>
        <TextInput
          value={formattedDate}
          editable={false}
          pointerEvents="none"
          placeholder={placeholder}
          className="h-12 rounded-xl border px-4"
        />
      </Pressable>
      {visible && (
        <DateTimePicker
          value={value}
          mode="date"
          onChange={(_, selectedDate) => {
            if (Platform.OS === "android") {
              setShowDatePicker(false);
            }

            if (selectedDate) {
              setInput(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}
// type field
function TypeOption({
  active,
  icon: Icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: typeof Plane;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className={
        active
          ? "min-h-[44px] flex-row items-center justify-center gap-xs rounded-app-full border border-primary-container bg-primary-container px-md py-sm"
          : "min-h-[44px] flex-row items-center justify-center gap-xs rounded-app-full border border-outline-variant bg-card px-md py-sm active:bg-surface-container-high"
      }
      onPress={onPress}
    >
      <Icon color={active ? "#004444" : "#3d4949"} size={18} />
      <Text
        className={
          active
            ? "text-body font-medium text-on-primary-container"
            : "text-body text-on-surface-variant"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function CreateOrUpdateBookingModal({
  booking,
  onClose,
  onTypeChange,
  type = "FLIGHT",
  visible,
  tripId,
}: CreateOrUpdateBookingModalProps) {
  const isUpdating = Boolean(booking);

  const queryClient = useQueryClient();

  const [baseBookingInfo, setBaseBookingInfo] = useState<BaseBookingInfo>({
    title: "",
    provider: "",
    confirmationCode: "",
    startTime: null,
    endTime: null,
    note: "",
  });

  const [flightInfo, setFlightInfo] = useState<FlightDetailsType>({
    flightNumber: "",
    departureAirport: "",
    arrivalAirport: "",
  });
  const [hotelInfo, setHotelInfo] = useState<HotelDetailsType>({
    address: "",
    roomType: "",
    checkInInstructions: "",
  });
  const [transportInfo, setTransportInfo] = useState<TransportDetailsType>({
    transportType: "",
    departureLocation: "",
    arrivalLocation: "",
  });
  const [activityInfo, setActivityInfo] = useState<ActivityDetailsType>({
    activityType: "",
    location: "",
    meetingPoint: "",
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const formattedStartDate = baseBookingInfo.startTime
    ? new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(baseBookingInfo.startTime)
    : "";

  const formattedEndDate = baseBookingInfo.endTime
    ? new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(baseBookingInfo.endTime)
    : "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  // handling submit
  async function handleSubmit() {
    if (isSubmitting) return;
    if (booking) {
      const originalTitle = booking.title;
      const currentTitle = baseBookingInfo.title.trim();
      const titleChanged = originalTitle !== currentTitle;

      const originalProvider = booking.provider; // this one is either some string or null
      const currentProvider = baseBookingInfo.provider?.trim() || null; // normalize an empty form string to domain null
      const providerChanged = originalProvider !== currentProvider;

      const originalConfirmationCode = booking.confirmationCode;
      const currentConfirmationCode =
        baseBookingInfo.confirmationCode?.trim() || null;
      const confirmationCodeChanged =
        originalConfirmationCode !== currentConfirmationCode;

      const originalNote = booking.note;
      const currentNote = baseBookingInfo.note?.trim() || null;
      const noteChanged = originalNote !== currentNote;

      const originalStartTime = booking.startTime; // original startTime is string or null and that's what API wants
      const currentStartTime = baseBookingInfo.startTime?.toISOString() ?? null; // convert it to string or null
      const startTimeChanged = originalStartTime !== currentStartTime;

      const originalEndTime = booking.endTime;
      const currentEndTime = baseBookingInfo.endTime?.toISOString() ?? null;
      const endTimeChanged = originalEndTime !== currentEndTime;

      const updateBody: UpdateBookingBody = {};

      if (titleChanged) {
        updateBody.title = currentTitle;
      }
      if (providerChanged) {
        updateBody.provider = currentProvider;
      }
      if (confirmationCodeChanged) {
        updateBody.confirmationCode = currentConfirmationCode;
      }
      if (noteChanged) {
        updateBody.note = currentNote;
      }
      if (startTimeChanged) {
        updateBody.startTime = currentStartTime;
      }
      if (endTimeChanged) {
        updateBody.endTime = currentEndTime;
      }
      if (booking.type === "FLIGHT") {
        const originalFlightDetails = booking.details;

        const currentFlightDetails: FlightDetailsType = {
          flightNumber: flightInfo.flightNumber.trim(),
          departureAirport: flightInfo.departureAirport.trim(),
          arrivalAirport: flightInfo.arrivalAirport.trim(),
        };

        const flightDetailsChanged =
          originalFlightDetails.flightNumber !==
            currentFlightDetails.flightNumber ||
          originalFlightDetails.departureAirport !==
            currentFlightDetails.departureAirport ||
          originalFlightDetails.arrivalAirport !==
            currentFlightDetails.arrivalAirport;

        if (flightDetailsChanged) {
          updateBody.details = currentFlightDetails;
        }
      }

      if (booking.type === "HOTEL") {
        const originalHotelDetails = {
          address: booking.details.address ?? null,
          roomType: booking.details.roomType ?? null,
          checkInInstructions: booking.details.checkInInstructions ?? null,
        };
        const currentHotelDetails: HotelDetailsType = {
          address: hotelInfo.address?.trim() || null,
          roomType: hotelInfo.roomType?.trim() || null,
          checkInInstructions: hotelInfo.checkInInstructions?.trim() || null,
        };

        const hotelDetailsChanged =
          originalHotelDetails.address !== currentHotelDetails.address ||
          originalHotelDetails.checkInInstructions !==
            currentHotelDetails.checkInInstructions ||
          originalHotelDetails.roomType !== currentHotelDetails.roomType;

        if (hotelDetailsChanged) {
          updateBody.details = currentHotelDetails;
        }
      }

      if (booking.type === "TRANSPORT") {
        const originalTransportDetails = {
          transportType: booking.details.transportType,
          departureLocation: booking.details.departureLocation ?? null,
          arrivalLocation: booking.details.arrivalLocation ?? null,
        };

        const currentTransportDetails: TransportDetailsType = {
          transportType: transportInfo.transportType.trim(),
          departureLocation: transportInfo.departureLocation?.trim() || null,
          arrivalLocation: transportInfo.arrivalLocation?.trim() || null,
        };
        const transportDetailsChanged =
          originalTransportDetails.arrivalLocation !==
            currentTransportDetails.arrivalLocation ||
          originalTransportDetails.departureLocation !==
            currentTransportDetails.departureLocation ||
          originalTransportDetails.transportType !==
            currentTransportDetails.transportType;
        if (transportDetailsChanged) {
          updateBody.details = currentTransportDetails;
        }
      }

      if (booking.type === "ACTIVITY") {
        const originalActivityDetails = {
          activityType: booking.details.activityType ?? null,
          location: booking.details.location ?? null,
          meetingPoint: booking.details.meetingPoint ?? null,
        };

        const currentActivityDetails: ActivityDetailsType = {
          activityType: activityInfo.activityType?.trim() || null,
          location: activityInfo.location?.trim() || null,
          meetingPoint: activityInfo.meetingPoint?.trim() || null,
        };

        const activityDetailsChanged =
          originalActivityDetails.activityType !==
            currentActivityDetails.activityType ||
          originalActivityDetails.location !== currentActivityDetails.location ||
          originalActivityDetails.meetingPoint !==
            currentActivityDetails.meetingPoint;

        if (activityDetailsChanged) {
          updateBody.details = currentActivityDetails;
        }
      }

      const hasChanges = Object.keys(updateBody).length > 0;
      if (!hasChanges) {
        return;
      }

      setIsSubmitting(true);
      try {
        await updateBooking({
          tripId,
          bookingId: booking.id,
          body: updateBody,
        });
        await queryClient.invalidateQueries({
          queryKey: bookingQueryKeys.byTrip(tripId),
        });
        onClose?.();
        Toast.show({ type: "success", text1: "Successfully updated booking" });
      } catch (e) {
        console.error("Failed to update booking: ", e);
        Toast.show({
          type: "error",
          text1: "Failed to update booking. Try again",
        });
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    const basicInfo = {
      title: baseBookingInfo.title.trim(),

      provider: baseBookingInfo.provider?.trim() || null,

      confirmationCode: baseBookingInfo.confirmationCode?.trim() || null,

      startTime: baseBookingInfo.startTime?.toISOString() ?? null,

      endTime: baseBookingInfo.endTime?.toISOString() ?? null,

      note: baseBookingInfo.note?.trim() || null,
    };

    let createBody: CreateBookingBody;

    switch (type) {
      case "FLIGHT":
        createBody = {
          ...basicInfo,
          type: "FLIGHT",
          details: {
            flightNumber: flightInfo.flightNumber.trim(),
            departureAirport: flightInfo.departureAirport.trim(),
            arrivalAirport: flightInfo.arrivalAirport.trim(),
          },
        };
        break;

      case "HOTEL":
        createBody = {
          ...basicInfo,
          type: "HOTEL",
          details: {
            address: hotelInfo.address?.trim() || null,
            roomType: hotelInfo.roomType?.trim() || null,
            checkInInstructions: hotelInfo.checkInInstructions?.trim() || null,
          },
        };
        break;

      case "TRANSPORT":
        createBody = {
          ...basicInfo,
          type: "TRANSPORT",
          details: {
            transportType: transportInfo.transportType.trim(),
            departureLocation: transportInfo.departureLocation?.trim() || null,
            arrivalLocation: transportInfo.arrivalLocation?.trim() || null,
          },
        };
        break;

      case "ACTIVITY":
        createBody = {
          ...basicInfo,
          type: "ACTIVITY",
          details: {
            activityType: activityInfo.activityType?.trim() || null,
            location: activityInfo.location?.trim() || null,
            meetingPoint: activityInfo.meetingPoint?.trim() || null,
          },
        };
        break;
    }

    setIsSubmitting(true);
    try {
      await createBooking({ tripId, body: createBody });
      await queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.byTrip(tripId),
      });
      onClose?.();
      Toast.show({ type: "success", text1: "Successfully added booking" });
    } catch (e) {
      console.error("Failed to add booking. ", e);
      Toast.show({ type: "error", text1: "Failed to add booking. Try again" });
    } finally {
      setIsSubmitting(false);
    }
  }

  // fill up fields if updating
  useEffect(() => {
    if (!booking) return;

    setBaseBookingInfo({
      title: booking.title,
      provider: booking.provider ?? "",
      confirmationCode: booking.confirmationCode ?? "",
      note: booking.note ?? "",
      startTime: booking.startTime ? new Date(booking.startTime) : null,

      endTime: booking.endTime ? new Date(booking.endTime) : null,
    });

    if (booking.type === "FLIGHT") {
      setFlightInfo(booking.details);
    }

    if (booking.type === "HOTEL") {
      setHotelInfo(booking.details);
    }
    if (booking.type === "TRANSPORT") {
      setTransportInfo(booking.details);
    }
    if (booking.type === "ACTIVITY") {
      setActivityInfo(booking.details);
    }
  }, [booking]);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end md:justify-center"
      >
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={45}
          style={StyleSheet.absoluteFill}
          tint="dark"
        />

        <StyledSafeAreaView
          className="max-h-[90%] w-full overflow-hidden rounded-t-app-xl bg-surface-container-lowest shadow-lg md:mx-auto md:max-w-xl md:rounded-app-xl"
          edges={["bottom"]}
          style={{ backgroundColor: "#ffffff", flex: 1 }}
        >
          <View className="w-full items-center pb-xs pt-sm md:hidden">
            <View className="h-unit w-12 rounded-app-full bg-outline-variant" />
          </View>

          <View className="row-between border-b border-outline-variant px-container py-md">
            <Text className="title-md">
              {isUpdating ? "Update Booking" : "Add Booking"}
            </Text>
            <Pressable
              accessibilityLabel="Close modal"
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-app-full active:bg-surface-container-high"
              hitSlop={4}
              onPress={onClose}
            >
              <X color="#3d4949" size={24} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerClassName="form p-container"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="form-group">
              <Text className="label">Type</Text>
              <View className="flex-row flex-wrap gap-sm">
                <TypeOption
                  active={type === "FLIGHT"}
                  icon={Plane}
                  label="Flight"
                  onPress={
                    isUpdating ? undefined : () => onTypeChange?.("FLIGHT")
                  }
                />
                <TypeOption
                  active={type === "HOTEL"}
                  icon={BedDouble}
                  label="Hotel"
                  onPress={
                    isUpdating ? undefined : () => onTypeChange?.("HOTEL")
                  }
                />
                <TypeOption
                  active={type === "TRANSPORT"}
                  icon={BusFront}
                  label="Transport"
                  onPress={
                    isUpdating ? undefined : () => onTypeChange?.("TRANSPORT")
                  }
                />
                <TypeOption
                  active={type === "ACTIVITY"}
                  icon={Ticket}
                  label="Activity"
                  onPress={
                    isUpdating ? undefined : () => onTypeChange?.("ACTIVITY")
                  }
                />
              </View>
            </View>
            <InputField
              label="Title"
              placeholder={type === "FLIGHT" ? "Flight to Tokyo" : "Hotel stay"}
              value={baseBookingInfo?.title ?? ""}
              onTextChange={(value) =>
                setBaseBookingInfo((prev) => ({ ...prev, title: value }))
              }
            />
            <InputField
              label="Provider"
              placeholder="e.g. Air Canada or Hilton"
              value={baseBookingInfo?.provider ?? ""}
              onTextChange={(provider) =>
                setBaseBookingInfo((prev) => ({ ...prev, provider: provider }))
              }
            />
            <InputField
              label="Confirmation Code"
              placeholder="Optional"
              value={baseBookingInfo?.confirmationCode ?? ""}
              onTextChange={(value) =>
                setBaseBookingInfo((prev) => ({
                  ...prev,
                  confirmationCode: value,
                }))
              }
            />
            <View className="flex-row gap-md">
              <DateTimeField
                label="Start Time"
                formattedDate={formattedStartDate}
                placeholder="start time..."
                visible={showStartDatePicker}
                value={baseBookingInfo.startTime ?? new Date()}
                setShowDatePicker={setShowStartDatePicker}
                setInput={(value) =>
                  setBaseBookingInfo((prev) => ({ ...prev, startTime: value }))
                }
              />
              <DateTimeField
                label="End Time"
                formattedDate={formattedEndDate}
                placeholder="end time..."
                visible={showEndDatePicker}
                value={baseBookingInfo.endTime ?? new Date()}
                setShowDatePicker={setShowEndDatePicker}
                setInput={(value) =>
                  setBaseBookingInfo((prev) => ({ ...prev, endTime: value }))
                }
              />
            </View>
            {type === "FLIGHT" && (
              <View className="form">
                <InputField
                  label="Flight Number"
                  placeholder="e.g. AC001"
                  value={flightInfo?.flightNumber ?? ""}
                  onTextChange={(value) =>
                    setFlightInfo((prev) => ({ ...prev, flightNumber: value }))
                  }
                />
                <InputField
                  label="Departure Airport"
                  placeholder="e.g. YVR"
                  value={flightInfo?.departureAirport ?? ""}
                  onTextChange={(value) =>
                    setFlightInfo((prev) => ({
                      ...prev,
                      departureAirport: value,
                    }))
                  }
                />
                <InputField
                  label="Arrival Airport"
                  placeholder="e.g. HND"
                  value={flightInfo?.arrivalAirport ?? ""}
                  onTextChange={(value) =>
                    setFlightInfo((prev) => ({
                      ...prev,
                      arrivalAirport: value,
                    }))
                  }
                />
              </View>
            )}
            {type === "HOTEL" && (
              <View className="form">
                <InputField
                  label="Address"
                  placeholder="Hotel address"
                  value={hotelInfo.address ?? ""}
                  onTextChange={(value) =>
                    setHotelInfo((prev) => ({ ...prev, address: value }))
                  }
                />
                <InputField
                  label="Room Type"
                  placeholder="e.g. King room"
                  value={hotelInfo.roomType ?? ""}
                  onTextChange={(value) =>
                    setHotelInfo((prev) => ({ ...prev, roomType: value }))
                  }
                />
                <InputField
                  label="Check-in Instructions"
                  multiline
                  placeholder="Optional check-in details"
                  value={hotelInfo.checkInInstructions ?? ""}
                  onTextChange={(value) =>
                    setHotelInfo((prev) => ({
                      ...prev,
                      checkInInstructions: value,
                    }))
                  }
                />
              </View>
            )}
            {type === "TRANSPORT" && (
              <View className="form">
                <InputField
                  label="Transport Type"
                  placeholder="Train"
                  value={transportInfo.transportType ?? ""}
                  onTextChange={(value) =>
                    setTransportInfo((prev) => ({
                      ...prev,
                      transportType: value,
                    }))
                  }
                />
                <InputField
                  label="Departure Location"
                  placeholder="Tokyo station"
                  value={transportInfo.departureLocation ?? ""}
                  onTextChange={(value) =>
                    setTransportInfo((prev) => ({
                      ...prev,
                      departureLocation: value,
                    }))
                  }
                />
                <InputField
                  label="Arrival Location"
                  placeholder="Osaka Station"
                  value={transportInfo.arrivalLocation ?? ""}
                  onTextChange={(value) =>
                    setTransportInfo((prev) => ({
                      ...prev,
                      arrivalLocation: value,
                    }))
                  }
                />
              </View>
            )}
            {type === "ACTIVITY" && (
              <View className="form">
                <InputField
                  label="Activity Type"
                  placeholder="Food tour"
                  value={activityInfo.activityType ?? ""}
                  onTextChange={(value) =>
                    setActivityInfo((prev) => ({
                      ...prev,
                      activityType: value,
                    }))
                  }
                />
                <InputField
                  label="Location"
                  placeholder="Shinjuku"
                  value={activityInfo.location ?? ""}
                  onTextChange={(value) =>
                    setActivityInfo((prev) => ({
                      ...prev,
                      location: value,
                    }))
                  }
                />
                <InputField
                  label="Meeting Point"
                  placeholder="Shinjuku Station East Exit"
                  value={activityInfo.meetingPoint ?? ""}
                  onTextChange={(value) =>
                    setActivityInfo((prev) => ({
                      ...prev,
                      meetingPoint: value,
                    }))
                  }
                />
              </View>
            )}
            <InputField
              label="Note"
              multiline
              placeholder="Optional notes"
              value={baseBookingInfo.note ?? ""}
              onTextChange={(value) =>
                setBaseBookingInfo((prev) => ({ ...prev, note: value }))
              }
            />
          </ScrollView>

          <View className="gap-md border-t border-outline-variant bg-card p-container md:flex-row md:justify-end">
            <Pressable className="btn-ghost md:px-lg" onPress={onClose}>
              <Text className="btn-ghost-text">Cancel</Text>
            </Pressable>
            <Pressable
              className="btn-primary md:px-lg"
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View className="flex flex-row items-center gap-2">
                  <Text>{isUpdating ? "Updating..." : "Adding..."}</Text>
                  <MiniSpinner />
                </View>
              ) : (
                <Text className="btn-danger-text">
                  {isUpdating ? "Update" : "Add"}
                </Text>
              )}
            </Pressable>
          </View>
        </StyledSafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
