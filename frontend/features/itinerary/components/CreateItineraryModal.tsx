import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MapPin, X } from "lucide-react-native";
import { useState } from "react";
import { ItineraryInput } from "../types/types";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  addItems: (item: ItineraryInput) => void;
  closeModal: () => void;
};

export default function CreateItineraryModal({ addItems, closeModal }: Props) {
  const [itineraryInputs, setItineraryInputs] = useState<ItineraryInput>({
    title: "",
    detail: "",
    location: "",
    startTime: new Date(),
  });
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(time);

  function combineDateAndTime(date: Date, time: Date): Date {
    const combined = new Date(date);

    combined.setHours(
      time.getHours(),
      time.getMinutes(),
      0, // seconds
      0, // milliseconds
    );

    return combined;
  }

  function onPress() {
    const startTime = combineDateAndTime(date, time);
    addItems({ ...itineraryInputs, startTime: startTime });
    resetInputs();
    closeModal();
  }

  function resetInputs() {
    setItineraryInputs({
      title: "",
      detail: "",
      location: "",
      startTime: new Date(),
    });
    setDate(new Date());
    setTime(new Date());
    setShowPicker(false);
    setShowTimePicker(false);
  }

  return (
    <View className="max-h-[90%] w-full overflow-hidden rounded-t-3xl bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-outline-variant bg-surface px-container-margin py-md">
        <Pressable className="h-11 w-11 items-start justify-center">
          <X size={28} className="text-on-surface-variant" />
        </Pressable>

        <Text className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
          Add Activity
        </Text>

        <Pressable
          className="rounded-full bg-secondary-container px-md py-sm"
          onPress={onPress}
        >
          <Text className="text-label-md font-label-md text-primary">Save</Text>
        </Pressable>
      </View>

      <ScrollView
        className="px-container-margin"
        contentContainerClassName="pb-12 pt-md"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-lg items-center">
          <Text className="text-center font-body-md italic text-on-surface-variant">
            Planning your next adventure in Kyoto
            {/* Change this title dynamically */}
          </Text>
        </View>

        <View className="gap-lg rounded-3xl border border-outline-variant bg-surface-container-lowest p-lg">
          {/* Activity title */}
          <View className="gap-xs">
            <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
              Activity Title
            </Text>

            <TextInput
              placeholder="e.g., Team Dinner at Gonpachi"
              className="h-12 rounded-xl border border-outline-variant bg-surface-container px-md text-body-lg
               text-on-surface"
              onChangeText={(title) => {
                setItineraryInputs((prev) => ({ ...prev, title: title }));
              }}
              value={itineraryInputs.title}
            />
          </View>

          {/* Location */}
          <View className="gap-xs">
            <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
              Location
            </Text>

            <View className="relative justify-center">
              <MapPin
                size={21}
                className="absolute left-md z-10 text-on-surface-variant"
              />

              <TextInput
                placeholder="Nishi-Azabu, Tokyo"
                className="h-12 rounded-xl border border-outline-variant bg-surface-container pl-12 pr-md text-body-lg text-on-surface"
                onChangeText={(location) =>
                  setItineraryInputs((prev) => ({ ...prev, location }))
                }
                value={itineraryInputs.location}
              />
            </View>
          </View>

          {/* Date */}
          <View className="gap-xs">
            <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
              Date
            </Text>

            <Pressable onPress={() => setShowPicker(true)}>
              <TextInput
                value={formattedDate}
                editable={false}
                pointerEvents="none"
                placeholder="Select date"
                className="h-12 rounded-xl border px-4"
              />
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={new Date(itineraryInputs.startTime)}
                mode="date"
                onChange={(_, selectedDate) => {
                  if (Platform.OS === "android") {
                    setShowPicker(false);
                  }

                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          {/* Times */}
          <View className="gap-xs">
            <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
              Start Time
            </Text>

            <Pressable onPress={() => setShowTimePicker(true)}>
              <TextInput
                value={formattedTime}
                editable={false}
                pointerEvents="none"
                placeholder="Select date"
                className="h-12 rounded-xl border px-4"
              />
            </Pressable>
            {showTimePicker && (
              <DateTimePicker
                value={new Date(itineraryInputs.startTime)}
                mode="time"
                onChange={(event, selectedTime) => {
                  if (Platform.OS === "android") {
                    setShowPicker(false);
                  }

                  if (event.type === "dismissed" || !selectedTime) {
                    return;
                  }

                  setTime(selectedTime);
                }}
              />
            )}
          </View>

          {/* Notes */}
          <View className="gap-xs">
            <Text className="px-1 text-label-md font-label-md text-on-surface-variant">
              Details / Notes
            </Text>

            <TextInput
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="What are the plans? e.g., Dress code is smart casual."
              className="min-h-28 rounded-xl border border-outline-variant bg-surface-container p-md text-body-lg text-on-surface"
              onChangeText={(details) =>
                setItineraryInputs((prev) => ({ ...prev, detail: details }))
              }
            />
          </View>

          {/* Photo */}
          {/* <View className="pt-md">
            <ImageBackground
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGjSQs0xpcTu4tCsAnN_hh7sgeHVTt3Bn7rbYEq8vJ4gklMzV_GlSVaeW5xQ5wA-ZgSAHSdpUzi5zqovBts-_1bALhboYzO8Z78Dmlb4mWAdxB01H_T8GK_1N7qJMSZbn85tDXdoQVPhZ6RUgzQyHQFUWtoUkM_Mc7ciC2UmzrsY6TaCnxKLw8lIM3impRcWrkRgslqISTwn7lodcEjkQYlSlLNaEsDTFqpUrZOot7UyCUWazpm_UZ",
              }}
              imageStyle={{ borderRadius: 16 }}
              className="h-48 w-full overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-high"
            >
              <View className="flex-1 justify-between bg-black/20 p-md">
                <View className="items-end">
                  <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-white/90">
                    <Camera size={22} className="text-primary" />
                  </Pressable>
                </View>

                <Text className="text-label-md font-label-md text-white">
                  Optional: Add a photo for this activity
                </Text>
              </View>
            </ImageBackground>
          </View> */}
        </View>

        {/* Bottom actions */}
        {/* <View className="mt-lg gap-md">
          <Pressable className="w-full flex-row items-center justify-center gap-sm rounded-2xl py-md">
            <Share2 size={21} className="text-primary" />

            <Text className="font-title-md text-primary">
              Invite Members to Activity
            </Text>
          </Pressable>

          <Pressable className="w-full flex-row items-center justify-center gap-sm py-md">
            <Trash2 size={20} className="text-on-surface-variant" />

            <Text className="text-label-md font-label-md text-on-surface-variant">
              Discard Draft
            </Text>
          </Pressable>
        </View> */}
      </ScrollView>
    </View>
  );
}
