import type { Metadata } from 'next';
import { JsonMinifierContent } from './content';

export const metadata: Metadata = {
  title: 'JSON Minifier - Compact JSON Online | JSON Prettify',
  description:
    'Remove all unnecessary whitespace from JSON to reduce file size. Free online JSON minifier with size comparison.',
  keywords: [
    'json minifier',
    'minify json',
    'compact json',
    'compress json',
    'reduce json size',
  ],
};

export default function JsonMinifierPage() {
  return <JsonMinifierContent />;
}
