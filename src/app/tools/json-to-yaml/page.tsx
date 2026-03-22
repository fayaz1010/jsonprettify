import type { Metadata } from 'next';
import { JsonToYamlContent } from './content';

export const metadata: Metadata = {
  title: 'JSON to YAML Converter Online | JSON Prettify',
  description:
    'Convert JSON data to YAML format instantly. Free online JSON to YAML converter with copy and download support.',
  keywords: [
    'json to yaml',
    'convert json to yaml',
    'json yaml converter',
    'json to yml',
    'yaml converter online',
  ],
};

export default function JsonToYamlPage() {
  return <JsonToYamlContent />;
}
