import type { Metadata } from 'next';
import { ForgotPasswordContent } from './content';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your JSON Prettify account password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
