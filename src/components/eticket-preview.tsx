"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ETicketData } from "@/lib/schemas";
import { Plane, ArrowRight } from "lucide-react";

export default function ETicketPreview() {
  const { watch } = useFormContext<ETicketData>();
  const data = watch();

  const DetailItem = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm font-medium">{value}</p>
      </div>
    ) : null;

  return (
    <Card className="print-receipt font-body shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">
              {data.airline || "LAVICEL TRAVEL AND TOURS"}
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Itinerary / Receipt
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <DetailItem label="Passenger Name" value={data.passengerName} />
          <DetailItem label="Ticket Number" value={data.ticketNumber} />
          <DetailItem
            label="Booking Reference"
            value={data.referenceNumber}
          />
          <DetailItem label="Issue Date" value={data.ticketingInfo} />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-headline font-semibold text-primary mb-3">Itinerary</h3>
          <div className="space-y-4">
            {data.itinerary?.map((item, index) => (
              <div key={item.id || index} className="p-3 rounded-lg bg-muted/30 space-y-3">
                <div className="flex justify-between items-center">
                   <DetailItem label="Date" value={item.date} />
                   <DetailItem label="Flight" value={item.flight} />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="text-center">
                        <p className="font-bold text-lg">{item.fromAirport}</p>
                        <p className="text-sm text-muted-foreground">{item.fromCity}</p>
                        <p className="text-sm font-mono">{item.departureTime}</p>
                    </div>
                    <div className="flex-grow flex justify-center items-center">
                        <Separator className="w-8" />
                        <Plane className="h-4 w-4 text-muted-foreground mx-2" />
                        <Separator className="flex-grow" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg">{item.toAirport}</p>
                        <p className="text-sm text-muted-foreground">{item.toCity}</p>
                        <p className="text-sm font-mono">{item.arrivalTime}</p>
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <DetailItem label="Seat" value={item.seat} />
                    <DetailItem label="Status" value={item.status} />
                    <DetailItem label="Remarks" value={item.remarks} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-headline font-semibold text-primary mb-3">Fare & Payment Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 rounded-lg bg-muted/30">
               <DetailItem label="Fare" value={data.fare} />
               <DetailItem label="Taxes & Fees" value={data.taxes} />
               <DetailItem label="Total Fare" value={data.totalFare} />
               <DetailItem label="Payment" value={data.paymentMethod} />
            </div>
             <div className="p-3 rounded-lg bg-muted/30">
                <DetailItem label="Fare Calculation" value={data.fareCalculation} />
             </div>
             <div className="p-3 rounded-lg bg-muted/30">
                <DetailItem label="Endorsements / Restrictions" value={data.endorsements} />
             </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground text-center w-full">
          Thank you for choosing {data.airline || "our airline"}. Please verify your travel documents and arrive at the airport with sufficient time.
        </p>
      </CardFooter>
    </Card>
  );
}
