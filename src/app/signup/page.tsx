import type { Metadata } from 'next';
import { SignupPageContent } from './content';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a JSON Prettify account to unlock Pro features including JSON Diff, Schema Validation, and unlimited file sizes.',
};

export default function SignupPage() {
  return <SignupPageContent />;
}
