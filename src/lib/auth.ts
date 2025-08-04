import {auth} from '@/lib/firebase';
import {
  onAuthStateChanged,
  type User,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import React from 'react';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthState>({
  user: null,
  loading: true,
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function useAuthSubscription() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {user, loading};
}

export async function signOut() {
  await firebaseSignOut(auth);
}
