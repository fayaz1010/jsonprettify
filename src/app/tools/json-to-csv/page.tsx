import type { Metadata } from 'next';
import { JsonToCsvContent } from './content';

export const metadata: Metadata = {
  title: 'JSON to CSV Converter Online | JSON Prettify',
  description:
    'Transform JSON arrays into CSV spreadsheet format for data analysis. Free online JSON to CSV converter.',
  keywords: [
    'json to csv',
    'convert json to csv',
    'json csv converter',
    'json to spreadsheet',
    'json to excel',
  ],
};

export default function JsonToCsvPage() {
  return <JsonToCsvContent />;
}
