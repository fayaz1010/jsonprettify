import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  body?: string;
  text?: string;
  html?: string;
}

// Lazy-initialized Resend client to avoid crashes when env var is missing at build time
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return null;
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendEmail({ to, subject, body, text, html }: EmailOptions): Promise<void> {
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'JSON Prettify <noreply@jsonprettify.com>';
  const resend = getResendClient();

  if (!resend) {
    console.warn('[email] RESEND_API_KEY not configured — email not sent.');
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html: html || body || '',
      text: text || body || '',
    });

    if (error) {
      console.error('[email] Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Failed to send email:')) {
      throw err;
    }
    console.error('[email] Failed to send email:', err instanceof Error ? err.message : err);
    throw new Error('Failed to send email. Please try again later.');
  }
}

export async function sendVerificationEmail(to: string, verificationLink: string): Promise<void> {
  const subject = 'Verify Your Email for JSON Prettify';

  const text = `Hello,

Thank you for signing up for JSON Prettify!

Please verify your email address by clicking the link below:

${verificationLink}

This link will expire in 24 hours. If you did not create an account, please ignore this email.

Thank you,
The JSON Prettify Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#0F172A;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F172A;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1E293B;border-radius:12px;border:1px solid #475569;">
        <tr><td style="padding:32px 40px;text-align:center;border-bottom:1px solid #475569;">
          <h1 style="margin:0;color:#E2E8F0;font-size:24px;font-weight:700;">JSON Prettify</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#E2E8F0;font-size:16px;line-height:1.6;margin:0 0 20px;">Hello,</p>
          <p style="color:#94A3B8;font-size:16px;line-height:1.6;margin:0 0 30px;">
            Thank you for signing up for JSON Prettify! Please verify your email address by clicking the button below:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:10px 0 30px;">
            <a href="${verificationLink}" style="display:inline-block;padding:14px 32px;background-color:#3B82F6;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">
              Verify Email
            </a>
          </td></tr></table>
          <p style="color:#64748B;font-size:14px;line-height:1.6;margin:0 0 10px;">
            This link will expire in 24 hours. If you did not create an account, please ignore this email.
          </p>
          <p style="color:#64748B;font-size:12px;line-height:1.6;margin:20px 0 0;word-break:break-all;">
            ${verificationLink}
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #475569;text-align:center;">
          <p style="color:#64748B;font-size:13px;margin:0;">Thank you,<br/>The JSON Prettify Team</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({ to, subject, text, html });
}

export function buildPasswordResetEmail(resetLink: string, expirationTime: string): { subject: string; body: string; html: string } {
  const subject = 'JSON Prettify - Password Reset Request';

  const body = `Hello,

You recently requested to reset your password for your JSON Prettify account. Click the link below to reset it:

${resetLink}

This link will expire in ${expirationTime}. If you did not request a password reset, please ignore this email.

Thank you,
The JSON Prettify Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#0F172A;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F172A;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1E293B;border-radius:12px;border:1px solid #475569;">
        <tr><td style="padding:32px 40px;text-align:center;border-bottom:1px solid #475569;">
          <h1 style="margin:0;color:#E2E8F0;font-size:24px;font-weight:700;">JSON Prettify</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#E2E8F0;font-size:16px;line-height:1.6;margin:0 0 20px;">Hello,</p>
          <p style="color:#94A3B8;font-size:16px;line-height:1.6;margin:0 0 30px;">
            You recently requested to reset your password for your JSON Prettify account. Click the button below to reset it:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:10px 0 30px;">
            <a href="${resetLink}" style="display:inline-block;padding:14px 32px;background-color:#3B82F6;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">
              Reset Password
            </a>
          </td></tr></table>
          <p style="color:#64748B;font-size:14px;line-height:1.6;margin:0 0 10px;">
            This link will expire in ${expirationTime}. If you did not request a password reset, please ignore this email.
          </p>
          <p style="color:#64748B;font-size:12px;line-height:1.6;margin:20px 0 0;word-break:break-all;">
            ${resetLink}
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #475569;text-align:center;">
          <p style="color:#64748B;font-size:13px;margin:0;">Thank you,<br/>The JSON Prettify Team</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, body, html };
}
