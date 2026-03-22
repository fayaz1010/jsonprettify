import type { Metadata } from 'next';
import { ResetPasswordContent } from './content';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your JSON Prettify account.',
};

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ResetPasswordContent token={token} />;
}
