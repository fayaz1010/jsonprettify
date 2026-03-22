'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type Plan = 'free' | 'pro';

interface SubscriptionState {
  plan: Plan;
  isProUser: boolean;
  loading: boolean;
  /** Upgrade the user to Pro (called after successful checkout) */
  activatePro: () => void;
  /** Downgrade the user to Free (called after subscription cancellation) */
  deactivatePro: () => void;
}

const SubscriptionContext = createContext<SubscriptionState>({
  plan: 'free',
  isProUser: false,
  loading: true,
  activatePro: () => {},
  deactivatePro: () => {},
});

const STORAGE_KEY = 'jsonprettify_subscription';

/**
 * Client-side subscription provider.
 *
 * NOTE: In a production application, subscription status would be
 * persisted in a database and verified server-side via Stripe webhooks.
 * This implementation uses localStorage for demonstration purposes.
 */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.plan === 'pro') {
          setPlan('pro');
        }
      }
    } catch {
      // Ignore storage errors
    }
    setLoading(false);
  }, []);

  const activatePro = useCallback(() => {
    setPlan('pro');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan: 'pro', activatedAt: new Date().toISOString() }));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const deactivatePro = useCallback(() => {
    setPlan('free');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        isProUser: plan === 'pro',
        loading,
        activatePro,
        deactivatePro,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
