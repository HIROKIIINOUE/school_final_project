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

export type ActivityDetailsType = {
  activityType?: string | null;
  location?: string | null;
  meetingPoint?: string | null;
};

export type UpdateBookingBody = {
  type?: "FLIGHT" | "HOTEL" | "TRANSPORT" | "ACTIVITY";
  title?: string;
  provider?: string | null;
  confirmationCode?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  note?: string | null;
  details?:
    | FlightDetailsType
    | HotelDetailsType
    | TransportDetailsType
    | ActivityDetailsType;
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

export type Booking =
  | FlightBooking
  | HotelBooking
  | TransportBooking
  | ActivityBooking;
export type GetBookings = { bookings: Booking[] };

export type CreatedBooking = { booking: Booking };

export type UpdatedBooking = { updatedBooking: Booking };

export type DeletedBooking = { deletedBooking: { bookingId: string } };

export type TransportDetailsType = {
  transportType: string;
  departureLocation?: string | null;
  arrivalLocation?: string | null;
};

type CreateBookingBase = {
  title: string;
  provider?: string | null;
  confirmationCode?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  note?: string | null;
};

export type CreateBookingBody =
  | (CreateBookingBase & { type: "FLIGHT"; details: FlightDetailsType })
  | (CreateBookingBase & { type: "HOTEL"; details: HotelDetailsType })
  | (CreateBookingBase & { type: "TRANSPORT"; details: TransportDetailsType })
  | (CreateBookingBase & { type: "ACTIVITY"; details: ActivityDetailsType });

export type TransportBooking = BookingBase & {
  type: "TRANSPORT";
  details: TransportDetailsType;
};

export type ActivityBooking = BookingBase & {
  type: "ACTIVITY";
  details: ActivityDetailsType;
};
