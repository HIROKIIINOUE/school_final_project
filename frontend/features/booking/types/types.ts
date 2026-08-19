export type FlightDetailsType = {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
};

export type HotelDetailsType = {
  address?: string;
  roomType?: string;
  checkInInstructions?: string;
};
export type CreateBookingBody = {
  type: "HOTEL" | "FLIGHT";
  title: string;
  provider?: string;
  confirmationCode?: string;
  startTime?: Date;
  endTime?: Date;
  note?: string;
  details: FlightDetailsType | HotelDetailsType;
};

export type UpdateBookingBody = {
  type?: "FLIGHT" | "HOTEL";
  title?: string;
  provider?: string;
  confirmationCode?: string;
  startTime?: Date;
  endTime?: Date;
  note?: string;
  details?: FlightDetailsType | HotelDetailsType;
};
