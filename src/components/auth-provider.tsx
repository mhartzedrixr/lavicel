"use client";

import { AuthContext, useAuthSubscription } from "@/lib/auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthSubscription();
  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}
