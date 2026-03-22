import type { Metadata } from 'next';
import { JsonFormatterContent } from './content';

export const metadata: Metadata = {
  title: 'JSON Formatter - Pretty Print JSON Online | JSON Prettify',
  description:
    'Beautify and format JSON with customizable indentation and syntax highlighting. Free online JSON formatter with validation and minification.',
  keywords: [
    'json formatter',
    'pretty print json',
    'beautify json',
    'format json online',
    'json indentation',
  ],
};

export default function JsonFormatterPage() {
  return <JsonFormatterContent />;
}
