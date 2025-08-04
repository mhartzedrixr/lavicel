import AuthGuard from '@/components/auth-guard';
import BookingsClient from '@/components/bookings-client';
import {getTickets} from '@/app/actions/tickets';

export default async function BookingsPage() {
  // This is a server component, but we need to pass an auth token for actions.
  // A better approach in a real app might be a dedicated backend API
  // or using Next.js middleware to manage auth.
  // For simplicity, we'll fetch on the client.
  
  return (
    <AuthGuard>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">My Bookings</h1>
        <BookingsClient />
      </div>
    </AuthGuard>
  );
}
