'use client';

import { useCurrentUser } from '@/hooks/useAuth';

export function AuthHydration({ children }: { children: React.ReactNode }) {
  useCurrentUser();
  return <>{children}</>;
}