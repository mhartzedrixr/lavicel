'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {LogOut, Plane, BookMarked} from 'lucide-react';
import {signOut, useAuth} from '@/lib/auth';
import {Button} from '@/components/ui/button';

export function AppSidebar() {
  const {user, loading} = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading || !user) {
    // Or a skeleton loader
    return null;
  }
   if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="w-64 min-h-screen bg-gray-50 border-r p-4 flex flex-col no-print">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary">LaVicel E-Ticket</h2>
      </div>
      <nav className="flex-1">
        <ul>
          <li>
            <Link href="/" passHref>
              <Button variant={pathname === '/' ? 'secondary' : 'ghost'} className="w-full justify-start">
                <Plane className="mr-2 h-4 w-4" />
                eTicket Generator
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/bookings" passHref>
              <Button variant={pathname === '/bookings' ? 'secondary' : 'ghost'} className="w-full justify-start">
                <BookMarked className="mr-2 h-4 w-4" />
                Bookings
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <div className="text-sm mb-2">
          <p>{user.email}</p>
        </div>
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
