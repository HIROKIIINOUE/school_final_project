import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react-native";
import { Text, View } from "react-native";

import type { Booking } from "@/features/booking/types/types";

import BookingCard from "./BookingCard";

type BookingSectionProps = {
  bookings: Booking[];
  emptyMessage: string;
  icon: ComponentType<LucideProps>;
  title: string;
  wide?: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
};

export default function BookingSection({
  bookings,
  emptyMessage,
  icon: Icon,
  title,
  wide = false,
  onEdit,
  onDelete,
}: BookingSectionProps) {
  return (
    <View className={wide ? "w-full gap-md" : "w-full gap-md md:flex-1"}>
      <View className="row gap-sm border-b border-outline-variant pb-xs">
        <Icon color="#6d7979" size={21} />
        <Text className="title-md">{title}</Text>
      </View>

      {bookings.length ? (
        bookings.map((booking) => (
          <BookingCard
            booking={booking}
            key={booking.id}
            onEdit={() => onEdit(booking)}
            onDelete={() => onDelete(booking)}
          />
        ))
      ) : (
        <View className="state-box">
          <Text className="text-muted">{emptyMessage}</Text>
        </View>
      )}
    </View>
  );
}
