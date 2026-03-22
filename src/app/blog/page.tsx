import type { Metadata } from 'next';
import { BlogPageContent } from './content';

export const metadata: Metadata = {
  title: 'Blog - JSON Tips & Tutorials',
  description: 'Learn about JSON formatting, API development, data conversion, and developer productivity tips.',
};

export default function BlogPage() {
  return <BlogPageContent />;
}
