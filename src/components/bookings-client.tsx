'use client';

import {useEffect, useState} from 'react';
import {getTickets} from '@/app/actions/tickets';
import type {ETicketData} from '@/lib/schemas';
import {useAuth} from '@/lib/auth';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

export default function BookingsClient() {
  const [tickets, setTickets] = useState<(ETicketData & {id: string})[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();

  useEffect(() => {
    if (user) {
      const fetchTickets = async () => {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('/api/actions/getTickets', {
             method: 'POST',
             headers: {
                Authorization: `Bearer ${idToken}`,
             }
          });

          if (!response.ok) {
             throw new Error('Failed to fetch tickets');
          }
          const fetchedTickets = await response.json();

          setTickets(fetchedTickets);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTickets();
    }
  }, [user]);

  if (loading) {
    return (
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
       </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Error: {error}</p>;
  }

  if (tickets.length === 0) {
    return <p>You have no saved bookings.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardHeader>
            <CardTitle>{ticket.passengerName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Ticket #:</strong> {ticket.ticketNumber}</p>
            <p><strong>Reference #:</strong> {ticket.referenceNumber}</p>
            <p><strong>Itinerary:</strong> {ticket.itinerary.map(i => `${i.fromAirport}-${i.toAirport}`).join(', ')}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// We need an API route to proxy our server action call with auth
// This is a workaround for calling server actions from client components
// that need authentication.
