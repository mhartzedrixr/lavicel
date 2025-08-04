
'use client';

import {useEffect, useState} from 'react';
import type {ETicketData} from '@/lib/schemas';
import {useAuth} from '@/lib/auth';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Button} from './ui/button';
import {Trash2} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

async function fetchApi(action: string, idToken: string, body?: any) {
    const res = await fetch(`/api/actions/${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'API request failed');
    }

    return res.json();
}


export default function BookingsClient() {
  const [tickets, setTickets] = useState<(ETicketData & {id: string})[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();
  const {toast} = useToast();

  const fetchTickets = async () => {
    if (user) {
      try {
        setLoading(true);
        setError(null);
        const idToken = await user.getIdToken(true);
        const { tickets: fetchedTickets } = await fetchApi('getTickets', idToken);
        setTickets(fetchedTickets);
      } catch (err: any) {
        setError(err.message);
        toast({
            variant: 'destructive',
            title: 'Error fetching tickets',
            description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);
  
  const handleDelete = async (ticketId: string) => {
    if(user) {
        try {
            const idToken = await user.getIdToken(true);
            await fetchApi('deleteTicket', idToken, { ticketId });
            toast({
                title: 'Success',
                description: 'Ticket deleted successfully.',
            });
            // Refresh the list of tickets
            await fetchTickets();
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.message || 'Failed to delete ticket.',
            });
        }
    }
  }

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
        <Card key={ticket.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{ticket.passengerName}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p><strong>Ticket #:</strong> {ticket.ticketNumber}</p>
            <p><strong>Reference #:</strong> {ticket.referenceNumber}</p>
            <p><strong>Itinerary:</strong> {ticket.itinerary.map(i => `${i.fromAirport}-${i.toAirport}`).join(', ')}</p>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the ticket
                    for {ticket.passengerName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(ticket.id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
