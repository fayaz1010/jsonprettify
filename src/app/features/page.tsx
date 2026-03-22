import type { Metadata } from 'next';
import { FeaturesPageContent } from './content';

export const metadata: Metadata = {
  title: 'Features - All JSON Tools',
  description: 'Explore all JSON Prettify tools: formatter, validator, minifier, converters, diff tool, schema validator, and interactive viewer.',
};

export default function FeaturesPage() {
  return <FeaturesPageContent />;
}
