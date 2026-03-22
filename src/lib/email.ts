// Placeholder email utility
// Replace with a real email service (e.g., SendGrid, Resend, AWS SES) in production

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailOptions): Promise<void> {
  // In production, integrate a real email service here
  console.log('--- EMAIL SENT ---');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${body}`);
  console.log('--- END EMAIL ---');
}

export function buildPasswordResetEmail(resetLink: string, expirationTime: string): { subject: string; body: string } {
  return {
    subject: 'JSON Prettify - Password Reset Request',
    body: `Hello,

You recently requested to reset your password for your JSON Prettify account. Click the link below to reset it:

${resetLink}

This link will expire in ${expirationTime}. If you did not request a password reset, please ignore this email.

Thank you,
The JSON Prettify Team`,
  };
}
