"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import type { ETicketData } from "@/lib/schemas";
import { getUniqueId } from "@/lib/schemas";
import { Textarea } from "./ui/textarea";

export default function ETicketForm() {
  const form = useFormContext<ETicketData>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itinerary",
  });

  const onSubmit = (data: ETicketData) => {
    console.log("Form submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Passenger Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="passengerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passenger Name</FormLabel>
                  <FormControl>
                    <Input placeholder="JOHN DOE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ticketNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123-4567890123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Airline</FormLabel>
                    <FormControl>
                      <Input placeholder="LAVICEL AIRLINES" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ticketingInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticketing Place/Date</FormLabel>
                    <FormControl>
                      <Input placeholder="ONLINE/25JUL24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="ABCDEF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary">Itinerary</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  id: getUniqueId(),
                  date: "",
                  city: "",
                  flight: "",
                  seat: "",
                  status: "CONFIRMED",
                  remarks: "",
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Leg
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg space-y-4 relative bg-background/50"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date/Time</FormLabel>
                        <FormControl>
                          <Input placeholder="26JUL / 10:00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.city`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City/Airport</FormLabel>
                        <FormControl>
                          <Input placeholder="NEW YORK / JFK" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.flight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight/Class</FormLabel>
                        <FormControl>
                          <Input placeholder="LV 123 / Y" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.seat`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seat</FormLabel>
                        <FormControl>
                          <Input placeholder="12A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Input placeholder="CONFIRMED" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`itinerary.${index}.remarks`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Input placeholder="NON-STOP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Fare Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input placeholder="CREDIT CARD - ************1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fare</FormLabel>
                    <FormControl>
                      <Input placeholder="USD 500.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxes/Fees/Charges</FormLabel>
                    <FormControl>
                      <Input placeholder="USD 50.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalFare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Fare</FormLabel>
                    <FormControl>
                      <Input placeholder="USD 550.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="fareCalculation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fare Calculation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="NYC LV PAR 500.00USD 500.00END"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endorsements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endorsements/Restrictions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="NON-REF/NON-END/CHG FEE"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}