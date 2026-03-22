import type { Metadata } from 'next';
import { PricingPageContent } from './content';
import { serverConfig } from '@/lib/server-config';

export const metadata: Metadata = {
  title: 'Pricing - JSON Prettify',
  description: 'Choose the perfect plan for your JSON workflow. Free tools for everyone, Pro for power users, Enterprise for teams.',
};

export default function PricingPage() {
  const stripePublishableKey = serverConfig.stripe.publishableKey || '';
  return <PricingPageContent stripePublishableKey={stripePublishableKey} />;
}
