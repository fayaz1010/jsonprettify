import type { Metadata } from 'next';
import { JsonViewerContent } from './content';

export const metadata: Metadata = {
  title: 'JSON Viewer - Interactive Tree View',
  description: 'Navigate complex nested JSON with an interactive, collapsible tree view.',
};

export default function JsonViewerPage() {
  return <JsonViewerContent />;
}
