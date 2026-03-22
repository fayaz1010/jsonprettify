import type { Metadata } from 'next';
import { LoginPageContent } from './content';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your JSON Prettify account to access Pro and Enterprise features.',
};

export default function LoginPage() {
  return <LoginPageContent />;
}
