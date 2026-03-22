'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';

type Plan = 'free' | 'pro';

interface SubscriptionState {
  plan: Plan;
  isProUser: boolean;
  loading: boolean;
  /** Re-fetch subscription status from the server */
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState>({
  plan: 'free',
  isProUser: false,
  loading: true,
  refreshSubscription: async () => {},
});

/**
 * Server-verified subscription provider.
 *
 * Fetches the authenticated user's subscription status from the
 * /api/subscription endpoint, which reads from the database.
 * Falls back to 'free' for unauthenticated users.
 */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [plan, setPlan] = useState<Plan>('free');
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (sessionStatus === 'loading') return;

    if (sessionStatus !== 'authenticated' || !session?.user) {
      setPlan('free');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/subscription');

      if (res.ok) {
        const data = await res.json();
        setPlan(data.subscription?.plan === 'pro' ? 'pro' : 'free');
      } else {
        setPlan('free');
      }
    } catch {
      setPlan('free');
    } finally {
      setLoading(false);
    }
  }, [session, sessionStatus]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        isProUser: plan === 'pro',
        loading,
        refreshSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
