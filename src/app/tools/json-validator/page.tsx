import type { Metadata } from 'next';
import { JsonValidatorContent } from './content';

export const metadata: Metadata = {
  title: 'JSON Validator - Check JSON Syntax Online | JSON Prettify',
  description:
    'Validate JSON syntax with precise error messages and line-level highlighting. Free online JSON validator with instant feedback.',
  keywords: [
    'json validator',
    'validate json',
    'json syntax checker',
    'json lint',
    'check json online',
  ],
};

export default function JsonValidatorPage() {
  return <JsonValidatorContent />;
}
