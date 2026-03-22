import type { Metadata } from 'next';
import { TermsPageContent } from './content';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'JSON Prettify terms of service. Read our terms and conditions for using the platform.',
};

export default function TermsPage() {
  return <TermsPageContent />;
}
