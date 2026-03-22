import type { Metadata } from 'next';
import { JsonDiffContent } from './content';

export const metadata: Metadata = {
  title: 'JSON Diff Tool - Compare JSON Online',
  description: 'Compare two JSON objects side by side and highlight differences.',
};

export default function JsonDiffPage() {
  return <JsonDiffContent />;
}
