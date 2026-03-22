import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Calendar, ArrowLeft } from 'lucide-react';
import type { Post } from '@/lib/blog';

export function BlogPostContent({ post }: { post: Post }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-accent mb-8 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {post.date}
              </span>
              <span>by {post.author}</span>
            </div>
          </header>

          <article
            className="prose prose-invert max-w-none
              prose-headings:text-text-primary prose-headings:font-semibold
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-text-primary
              prose-code:text-accent prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-lg
              prose-li:text-text-secondary
              prose-ul:text-text-secondary prose-ol:text-text-secondary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
