'use client';

import ETicketManager from '@/components/eticket-manager';
import {Toaster} from '@/components/ui/toaster';
import AuthGuard from '@/components/auth-guard';

export default function Home() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-background">
        <ETicketManager />
        <Toaster />
      </main>
    </AuthGuard>
  );
}
