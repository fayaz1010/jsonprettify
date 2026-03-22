import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';

export function BlogPageContent() {
  const posts = getAllPosts();

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
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card hover className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="text-xs text-text-muted">by {post.author}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-accent font-medium">
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
