'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const POSTS = [
  {
    slug: 'json-formatting-best-practices',
    title: 'JSON Formatting Best Practices for Clean, Readable Code',
    excerpt: 'Learn how to structure and format JSON for maximum readability and maintainability across your projects.',
    date: '2026-03-15',
    readTime: '5 min read',
    category: 'Best Practices',
  },
  {
    slug: 'json-vs-yaml-when-to-use-which',
    title: 'JSON vs YAML: When to Use Which Format',
    excerpt: 'A comprehensive comparison of JSON and YAML formats, with practical guidance on choosing the right one for your use case.',
    date: '2026-03-10',
    readTime: '7 min read',
    category: 'Guides',
  },
  {
    slug: 'validating-api-responses-with-json-schema',
    title: 'Validating API Responses with JSON Schema',
    excerpt: 'How to use JSON Schema to validate API responses and catch data issues before they reach production.',
    date: '2026-03-05',
    readTime: '8 min read',
    category: 'Tutorials',
  },
  {
    slug: 'converting-large-json-to-csv',
    title: 'How to Convert Large JSON Files to CSV Efficiently',
    excerpt: 'Step-by-step guide to transforming complex JSON datasets into CSV format for spreadsheet analysis.',
    date: '2026-02-28',
    readTime: '6 min read',
    category: 'Tutorials',
  },
  {
    slug: 'json-diff-for-debugging-apis',
    title: 'Using JSON Diff to Debug API Changes',
    excerpt: 'Learn how JSON diff tools can help you identify breaking changes in API responses during development.',
    date: '2026-02-20',
    readTime: '4 min read',
    category: 'Tips',
  },
  {
    slug: 'client-side-json-processing-privacy',
    title: 'Why Client-Side JSON Processing Matters for Privacy',
    excerpt: 'Understanding the privacy benefits of processing sensitive JSON data locally instead of sending it to remote servers.',
    date: '2026-02-15',
    readTime: '5 min read',
    category: 'Privacy',
  },
];

export function BlogPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Blog</h1>
            <p className="text-lg text-text-secondary">
              Tips, tutorials, and best practices for working with JSON data.
            </p>
          </div>

          <div className="space-y-6">
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="group bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-text-secondary mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm text-accent font-medium">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
