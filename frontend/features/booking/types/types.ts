export type FlightDetailsType = {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
};

export type HotelDetailsType = {
  address?: string | null;
  roomType?: string | null;
  checkInInstructions?: string | null;
};

export type CreateBookingBody = {
  type: "HOTEL" | "FLIGHT";
  title: string;
  provider?: string | null;
  confirmationCode?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  note?: string | null;
  details: FlightDetailsType | HotelDetailsType;
};

export type UpdateBookingBody = {
  type?: "FLIGHT" | "HOTEL";
  title?: string;
  provider?: string | null;
  confirmationCode?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  note?: string | null;
  details?: FlightDetailsType | HotelDetailsType;
};

export type BookingBase = {
  id: string;
  tripId: string;
  createdById: string;
  title: string;
  provider: string | null;
  confirmationCode: string | null;
  startTime: string | null;
  endTime: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FlightBooking = BookingBase & {
  type: "FLIGHT";
  details: FlightDetailsType;
};
export type HotelBooking = BookingBase & {
  type: "HOTEL";
  details: HotelDetailsType;
};

export type Booking = FlightBooking | HotelBooking;
export type GetBookings = { bookings: Booking[] };

export type CreatedBooking = { booking: Booking };

export type UpdatedBooking = { updatedBooking: Booking };

export type DeletedBooking = { deletedBooking: { bookingId: string } };
