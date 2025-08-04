"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eTicketSchema, type ETicketData, getUniqueId } from "@/lib/schemas";
import ETicketForm from "@/components/eticket-form";
import ETicketPreview from "@/components/eticket-preview";
import React, { useState, useEffect } from "react";
import PrintButton from "./print-button";
import Image from "next/image";
import { Button } from "./ui/button";
import { saveTicket } from "@/app/actions/tickets";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Save, Loader2 } from "lucide-react";

const defaultValues: ETicketData = {
  passengerName: "JOHN DOE",
  ticketNumber: "123-4567890123",
  airline: "LaVicel Travel and Tours",
  ticketingInfo: "ONLINE/25JUL24",
  referenceNumber: "ABCDEF",
  itinerary: [
    {
      id: getUniqueId(),
      date: "26JUL",
      fromCity: "New York",
      fromAirport: "JFK",
      departureTime: "10:00",
      toCity: "Paris",
      toAirport: "CDG",
      arrivalTime: "22:00",
      flight: "LV 123 / Y",
      seat: "12A",
      status: "CONFIRMED",
      remarks: "NON-STOP",
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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const methods = useForm<ETicketData>({
    resolver: zodResolver(eTicketSchema),
    defaultValues,
  });

  const handleSaveTicket = async () => {
    const isValid = await methods.trigger();
    if (isValid && user) {
      setIsSaving(true);
      const data = methods.getValues();
      try {
        const idToken = await user.getIdToken();
        await saveTicket({ ...data, userId: user.uid }, idToken);
        toast({
          title: "Success",
          description: "Ticket saved successfully.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save ticket.",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isClient) {
    return null; 
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center no-print">
          <div className="flex items-center gap-3">
            <Image 
              src="https://placehold.co/40x40.png"
              alt="Company Logo"
              width={40}
              height={40}
              className="rounded-full"
              data-ai-hint="logo"
            />
            <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">
              LaVicel eTicket Generator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveTicket} variant="outline" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Ticket
            </Button>
            <PrintButton />
          </div>
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
