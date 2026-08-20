import {
  AlertTriangle,
  BedDouble,
  Clock,
  PlaneTakeoff,
  CalendarDays,
  Pencil,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import type { Booking } from "@/features/booking/types/types";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react-native";

type BookingCardProps = { booking: Booking; onEdit: () => void };

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function toDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string | null) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "Not set";
}

function formatTime(value: string | null) {
  const date = toDate(value);
  return date ? timeFormatter.format(date) : "Not set";
}

function formatStay(startTime: string | null, endTime: string | null) {
  const start = toDate(startTime);
  const end = toDate(endTime);

  if (!start && !end) return "Dates not set";
  if (!start) return `Until ${dateFormatter.format(end!)}`;
  if (!end) return `From ${dateFormatter.format(start)}`;

  const nights = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 86_400_000),
  );
  const nightLabel = nights === 1 ? "night" : "nights";

  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)} (${nights} ${nightLabel})`;
}

function MetaField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: ComponentType<LucideProps>;
}) {
  return (
    <View className="min-w-24 flex-1 gap-xs">
      <View className="flex flex-row items-center gap-sm">
        {Icon && <Icon color="#6d7979" size={21} />}
        <Text className="label">{label}</Text>
      </View>
      <Text className="text-body-lg font-medium">{value}</Text>
    </View>
  );
}

function FlightCard({
  booking,
  onEdit,
}: {
  booking: Extract<Booking, { type: "FLIGHT" }>;
  onEdit: () => void;
}) {
  const subtitle = `${booking.details.departureAirport} → ${booking.details.arrivalAirport}`;

  return (
    <View className="card">
      <View className="card-row items-start">
        <View className="min-w-0 flex-1 flex-row items-start gap-sm">
          <View className="h-10 w-10 flex-none items-center justify-center rounded-app-full bg-surface-container-high">
            <PlaneTakeoff color="#006a6a" size={22} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="card-title">{booking.title}</Text>
            <Text className="card-subtitle">
              {booking.details.flightNumber} · {subtitle}
            </Text>
            {booking.provider ? (
              <Text className="card-meta mt-xs">{booking.provider}</Text>
            ) : null}
          </View>
          <View>
            <Pressable
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-app-full bg-secondary-container"
              onPress={onEdit}
            >
              <Pencil size={18} className="text-primary" />
            </Pressable>
          </View>
        </View>
      </View>

      <View className="ml-12 flex-row flex-wrap gap-md">
        <MetaField
          label="Date"
          value={formatDate(booking.startTime)}
          icon={CalendarDays}
        />
        <MetaField
          label="Time"
          value={formatTime(booking.startTime)}
          icon={Clock}
        />
        {booking.confirmationCode ? (
          <MetaField label="Confirmation" value={booking.confirmationCode} />
        ) : null}
      </View>

      {booking.note ? (
        <View className="card-muted ml-12">
          <Text className="label">Note</Text>
          <Text className="text-body mt-xs">{booking.note}</Text>
        </View>
      ) : null}
    </View>
  );
}

function HotelCard({
  booking,
}: {
  booking: Extract<Booking, { type: "HOTEL" }>;
}) {
  return (
    <View className="card">
      <View className="card-row items-start">
        <View className="min-w-0 flex-1 flex-row items-start gap-sm">
          <View
            className={
              "h-10 w-10 flex-none items-center justify-center rounded-app-full bg-surface-container-high"
            }
          >
            <BedDouble color={"#006a6a"} size={22} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="card-title">{booking.title}</Text>
            <Text className="card-subtitle">
              {booking.details.address ?? booking.provider ?? "Address not set"}
            </Text>
            {booking.details.roomType ? (
              <Text className="card-meta mt-xs">
                {booking.details.roomType}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <View className="ml-12 gap-sm">
        <MetaField
          label="Stay"
          value={formatStay(booking.startTime, booking.endTime)}
        />
        {booking.confirmationCode ? (
          <MetaField label="Confirmation" value={booking.confirmationCode} />
        ) : null}
      </View>

      {booking.details.checkInInstructions ? (
        <View className="card-muted ml-12">
          <Text className="label">Check-in instructions</Text>
          <Text className="text-body mt-xs">
            {booking.details.checkInInstructions}
          </Text>
        </View>
      ) : null}

      {booking.note ? (
        <View className="card-muted ml-12">
          <Text className="label">Note</Text>
          <Text className="text-body mt-xs">{booking.note}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function BookingCard({ booking, onEdit }: BookingCardProps) {
  return booking.type === "FLIGHT" ? (
    <FlightCard booking={booking} onEdit={onEdit} />
  ) : (
    <HotelCard booking={booking} />
  );
}
