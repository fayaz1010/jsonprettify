import type { Metadata } from 'next';
import { JsonSchemaValidatorContent } from './content';

export const metadata: Metadata = {
  title: 'JSON Schema Validator Online',
  description: 'Validate JSON data against a JSON Schema definition.',
};

export default function JsonSchemaValidatorPage() {
  return <JsonSchemaValidatorContent />;
}
