import type { Metadata } from 'next';
import { VerifyEmailContent } from './content';

export const metadata: Metadata = {
  title: 'Verify Your Email - JSON Prettify',
  description: 'Verify your email address to complete your JSON Prettify account setup.',
};

export default function VerifyEmailPage() {
  return <VerifyEmailContent />;
}
