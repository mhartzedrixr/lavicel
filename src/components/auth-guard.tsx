'use client';

import {useRouter} from 'next/navigation';
import React from 'react';
import {useAuth} from '@/lib/auth';
import {Skeleton} from './ui/skeleton';

export default function AuthGuard({children}: {children: React.ReactNode}) {
  const {user, loading} = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
