import { BlurView } from "expo-blur";
import { BedDouble, CalendarDays, Plane, X } from "lucide-react-native";
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
  HotelDetailsType,
  type Booking,
  type FlightDetailsType,
} from "../types/types";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createBooking, updateBooking } from "../api/booking.api";

const StyledSafeAreaView = styled(SafeAreaView);

type BookingType = Booking["type"];

type CreateOrUpdateBookingModalProps = {
  visible: boolean;
  type: BookingType;
  booking?: Booking | null;
  onClose?: () => void;
  onTypeChange?: (type: BookingType) => void;
  handleSubmit: () => void;
  tripId: string;
};

type InputFieldProps = {
  defaultValue?: string | null;
  label: string;
  multiline?: boolean;
  placeholder: string;
  value: string;
  onTextChange: (value: string) => void;
};

function InputField({
  defaultValue,
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
        defaultValue={defaultValue ?? undefined}
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

type BaseBookingInfo = {
  title: string;
  provider?: string | null;
  confirmationCode?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  note?: string | null;
};

export default function CreateOrUpdateBookingModal({
  booking,
  onClose,
  onTypeChange,
  type = "FLIGHT",
  visible,
  tripId,
}: CreateOrUpdateBookingModalProps) {
  const flightDetails = booking?.type === "FLIGHT" ? booking.details : null;
  const hotelDetails = booking?.type === "HOTEL" ? booking.details : null;
  const isUpdating = Boolean(booking);

  const [baseBookingInfo, setBaseBookingInfo] = useState<BaseBookingInfo>({
    title: "",
    provider: "",
    confirmationCode: "",
    startTime: new Date(),
    endTime: new Date(),
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

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const formattedStartDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(baseBookingInfo?.startTime);

  const formattedEndDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(baseBookingInfo?.endTime);

  const [selectedType, setSelectedType] = useState<"FLIGHT" | "HOTEL">(
    "FLIGHT",
  );

  async function handleSubmit() {
    const datatoSend =
      selectedType === "FLIGHT"
        ? { ...baseBookingInfo, ...flightInfo }
        : { ...baseBookingInfo, ...hotelInfo };

    isUpdating
      ? await updateBooking({
          tripId,
          bookingId: booking?.id,
          body: datatoSend,
        })
      : await createBooking({ tripId, body: datatoSend });
  }

  useEffect(() => {
    if (!booking) return;

    setBaseBookingInfo({
      title: booking.title,
      provider: booking.provider ?? "",
      confirmationCode: booking.confirmationCode ?? "",
      note: booking.note ?? "",
      startTime: booking.startTime ? new Date(booking.startTime) : new Date(),
      endTime: booking.endTime ? new Date(booking.endTime) : new Date(),
    });
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
                  active={selectedType === "FLIGHT"}
                  icon={Plane}
                  label="Flight"
                  onPress={() => setSelectedType("FLIGHT")}
                />
                <TypeOption
                  active={selectedType === "HOTEL"}
                  icon={BedDouble}
                  label="Hotel"
                  onPress={() => setSelectedType("FLIGHT")}
                />
              </View>
            </View>

            <InputField
              defaultValue={booking?.title}
              label="Title"
              placeholder={type === "FLIGHT" ? "Flight to Tokyo" : "Hotel stay"}
              value={baseBookingInfo?.title ?? ""}
              onTextChange={(value) =>
                setBaseBookingInfo((prev) => ({ ...prev, title: value }))
              }
            />
            <InputField
              defaultValue={booking?.provider}
              label="Provider"
              placeholder="e.g. Air Canada or Hilton"
              value={baseBookingInfo?.provider ?? ""}
              onTextChange={(provider) =>
                setBaseBookingInfo((prev) => ({ ...prev, provider: provider }))
              }
            />
            <InputField
              defaultValue={booking?.confirmationCode}
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
                  setBaseBookingInfo((prev) => ({ ...prev, end: value }))
                }
              />
            </View>

            {type === "FLIGHT" ? (
              <View className="form">
                <InputField
                  defaultValue={flightInfo?.flightNumber}
                  label="Flight Number"
                  placeholder="e.g. AC001"
                  value={flightDetails?.flightNumber ?? ""}
                  onTextChange={(value) =>
                    setFlightInfo((prev) => ({ ...prev, flightNumber: value }))
                  }
                />
                <InputField
                  defaultValue={flightDetails?.departureAirport}
                  label="Departure Airport"
                  placeholder="e.g. YVR"
                  value={flightDetails?.departureAirport ?? ""}
                  onTextChange={(value) =>
                    setFlightInfo((prev) => ({
                      ...prev,
                      departureAirport: value,
                    }))
                  }
                />
                <InputField
                  defaultValue={flightDetails?.arrivalAirport}
                  label="Arrival Airport"
                  placeholder="e.g. HND"
                  value={flightDetails?.arrivalAirport ?? ""}
                  onTextChange={(value) =>
                    setFlightInfo((prev) => ({
                      ...prev,
                      arrivalAirport: value,
                    }))
                  }
                />
              </View>
            ) : (
              <View className="form">
                <InputField
                  defaultValue={hotelDetails?.address}
                  label="Address"
                  placeholder="Hotel address"
                  value={hotelInfo.address ?? ""}
                  onTextChange={(value) =>
                    setHotelInfo((prev) => ({ ...prev, address: value }))
                  }
                />
                <InputField
                  defaultValue={hotelDetails?.roomType}
                  label="Room Type"
                  placeholder="e.g. King room"
                  value={hotelInfo.roomType ?? ""}
                  onTextChange={(value) =>
                    setHotelInfo((prev) => ({ ...prev, roomType: value }))
                  }
                />
                <InputField
                  defaultValue={hotelDetails?.checkInInstructions}
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

            <InputField
              defaultValue={booking?.note}
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
            <Pressable className="btn-primary md:px-lg" onPress={handleSubmit}>
              <Text className="btn-primary-text">
                {isUpdating ? "Save Changes" : "Add to Trip"}
              </Text>
            </Pressable>
          </View>
        </StyledSafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
