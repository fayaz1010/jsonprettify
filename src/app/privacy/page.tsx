import type { Metadata } from 'next';
import { PrivacyPageContent } from './content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'JSON Prettify privacy policy. All JSON processing happens client-side — your data never leaves your browser.',
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
