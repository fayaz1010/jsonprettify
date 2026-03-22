export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function pageView(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  window.gtag('event', eventName, params);
}
