import type { Metadata } from 'next';
import { ContactPageContent } from './content';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the JSON Prettify team. We are here to help with questions, feedback, and support.',
};

export default function ContactPage() {
  return <ContactPageContent />;
}
