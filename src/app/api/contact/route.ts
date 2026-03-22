import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { name, email, subject, message } = body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }
  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  const safeName = sanitize(name.trim());
  const safeEmail = sanitize(email.trim());
  const safeSubject = subject ? sanitize(subject.trim()) : 'General Inquiry';
  const safeMessage = sanitize(message.trim());

  const recipient = process.env.CONTACT_FORM_RECIPIENT_EMAIL;
  if (!recipient) {
    console.warn('[contact] CONTACT_FORM_RECIPIENT_EMAIL is not configured — logging form submission only.');
    console.log('[contact] Form submission:', { safeName: sanitize(name.trim()), safeEmail: sanitize(email.trim()), safeSubject: subject ? sanitize(subject.trim()) : 'General Inquiry', message: '[redacted]' });
    return NextResponse.json({ message: 'Message sent successfully!' });
  }

  const text = `Name: ${safeName}\nEmail: ${safeEmail}\nSubject: ${safeSubject}\n\n${safeMessage}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#0F172A;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F172A;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1E293B;border-radius:12px;border:1px solid #475569;">
        <tr><td style="padding:32px 40px;text-align:center;border-bottom:1px solid #475569;">
          <h1 style="margin:0;color:#E2E8F0;font-size:24px;font-weight:700;">New Contact Form Submission</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="padding:8px 0;color:#94A3B8;font-size:14px;width:80px;vertical-align:top;">Name:</td><td style="padding:8px 0;color:#E2E8F0;font-size:14px;">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8;font-size:14px;vertical-align:top;">Email:</td><td style="padding:8px 0;color:#3B82F6;font-size:14px;"><a href="mailto:${safeEmail}" style="color:#3B82F6;text-decoration:none;">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8;font-size:14px;vertical-align:top;">Subject:</td><td style="padding:8px 0;color:#E2E8F0;font-size:14px;">${safeSubject}</td></tr>
          </table>
          <div style="border-top:1px solid #475569;padding-top:24px;">
            <p style="color:#94A3B8;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
            <p style="color:#E2E8F0;font-size:15px;line-height:1.7;margin:0;">${safeMessage.replace(/\n/g, '<br />')}</p>
          </div>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #475569;text-align:center;">
          <p style="color:#64748B;font-size:13px;margin:0;">JSON Prettify Contact Form</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await sendEmail({
      to: recipient,
      subject: `Contact Form: ${safeSubject}`,
      text,
      html,
    });
  } catch (err) {
    console.error('Failed to send contact email:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'Message sent successfully!' });
}
