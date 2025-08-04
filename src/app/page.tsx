'use client';

import ETicketManager from '@/components/eticket-manager';
import {Toaster} from '@/components/ui/toaster';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ETicketManager />
      <Toaster />
    </main>
  );
}
