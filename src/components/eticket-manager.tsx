"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eTicketSchema, type ETicketData, getUniqueId } from "@/lib/schemas";
import ETicketForm from "@/components/eticket-form";
import ETicketPreview from "@/components/eticket-preview";
import { Button } from "@/components/ui/button";
import { Printer, Plane } from "lucide-react";
import React, { useState, useEffect } from "react";

const defaultValues: ETicketData = {
  passengerName: "JOHN DOE",
  ticketNumber: "123-4567890123",
  airline: "LAVICEL TRAVEL AND TOURS",
  ticketingInfo: "ONLINE/25JUL24",
  referenceNumber: "ABCDEF",
  itinerary: [
    {
      id: getUniqueId(),
      date: "26JUL / 10:00",
      city: "NEW YORK / JFK",
      flight: "LV 123 / Y",
      seat: "12A",
      status: "CONFIRMED",
      remarks: "NON-STOP",
    },
     {
      id: getUniqueId(),
      date: "26JUL / 18:30",
      city: "PARIS / CDG",
      flight: "LV 123 / Y",
      seat: "12A",
      status: "CONFIRMED",
      remarks: "ARRIVAL",
    },
  ],
  paymentMethod: "CREDIT CARD - ************1234",
  fare: "USD 500.00",
  taxes: "USD 50.00",
  totalFare: "USD 550.00",
  fareCalculation: "NYC LV PAR 500.00USD 500.00END",
  endorsements: "NON-REF/NON-END/CHG FEE",
};

export default function ETicketManager() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const methods = useForm<ETicketData>({
    resolver: zodResolver(eTicketSchema),
    defaultValues,
  });

  const handlePrint = () => {
    window.print();
  };

  if (!isClient) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center no-print">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">
              LaVicel Travel and Tours eTicket
            </h1>
          </div>
          <Button onClick={handlePrint} variant="default" size="lg">
            <Printer className="mr-2 h-5 w-5" />
            Print Receipt
          </Button>
        </header>
        <div className="grid lg:grid-cols-2 lg:gap-12">
          <div className="no-print">
            <ETicketForm />
          </div>
          <div className="print-container">
            <ETicketPreview />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
