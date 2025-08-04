import { z } from "zod";

export const itineraryItemSchema = z.object({
  id: z.string(),
  date: z.string().min(1, "Date is required"),
  fromCity: z.string().min(1, "Departure city is required"),
  fromAirport: z.string().min(1, "Departure airport is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  toCity: z.string().min(1, "Arrival city is required"),
  toAirport: z.string().min(1, "Arrival airport is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  flight: z.string().min(1, "Flight/Class is required"),
  seat: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  remarks: z.string().optional(),
});

export const eTicketSchema = z.object({
  passengerName: z.string().min(1, "Passenger name is required"),
  ticketNumber: z.string().min(1, "Ticket number is required"),
  airline: z.string().min(1, "Airline is required"),
  ticketingInfo: z.string().min(1, "Ticketing place/date is required"),
  referenceNumber: z.string().min(1, "Reference number is required"),
  itinerary: z.array(itineraryItemSchema),
  paymentMethod: z.string().min(1, "Payment method is required"),
  fare: z.string().min(1, "Fare is required"),
  taxes: z.string().min(1, "Taxes/Fees/Charges are required"),
  totalFare: z.string().min(1, "Total fare is required"),
  fareCalculation: z.string().min(1, "Fare calculation is required"),
  endorsements: z.string().optional(),
});

export type ETicketData = z.infer<typeof eTicketSchema>;
export type ItineraryItemData = z.infer<typeof itineraryItemSchema>;

let nextId = 0;
export const getUniqueId = () => `id-${nextId++}`