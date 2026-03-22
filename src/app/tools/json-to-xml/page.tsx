import type { Metadata } from 'next';
import { JsonToXmlContent } from './content';

export const metadata: Metadata = {
  title: 'JSON to XML Converter Online | JSON Prettify',
  description:
    'Convert JSON objects to well-formed XML documents. Free online JSON to XML converter with instant results.',
  keywords: [
    'json to xml',
    'convert json to xml',
    'json xml converter',
    'json to xml online',
    'xml converter',
  ],
};

export default function JsonToXmlPage() {
  return <JsonToXmlContent />;
}
