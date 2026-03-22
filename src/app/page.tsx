'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PrivacyBadge } from '@/components/shared/privacy-badge';
import { AdBanner } from '@/components/shared/ad-banner';
import {
  Wand2, CheckCircle, Minimize2, ArrowRight, FileCode,
  Table, Code, GitCompare, Shield, Eye, Zap, Lock, Globe
} from 'lucide-react';

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701"
  },
  "hobbies": ["reading", "coding", "hiking"],
  "scores": [98, 87, 92, 100]
}`;

const TOOLS = [
  { name: 'JSON Formatter', slug: 'json-formatter', icon: Wand2, description: 'Beautify and format JSON with customizable indentation', tier: 'free' },
  { name: 'JSON Validator', slug: 'json-validator', icon: CheckCircle, description: 'Validate JSON syntax with precise error highlighting', tier: 'free' },
  { name: 'JSON Minifier', slug: 'json-minifier', icon: Minimize2, description: 'Compact JSON by removing all unnecessary whitespace', tier: 'free' },
  { name: 'JSON to YAML', slug: 'json-to-yaml', icon: FileCode, description: 'Convert JSON data to YAML format instantly', tier: 'free' },
  { name: 'JSON to CSV', slug: 'json-to-csv', icon: Table, description: 'Transform JSON arrays into CSV spreadsheet format', tier: 'free' },
  { name: 'JSON to XML', slug: 'json-to-xml', icon: Code, description: 'Convert JSON objects to well-formed XML documents', tier: 'free' },
  { name: 'JSON Diff', slug: 'json-diff', icon: GitCompare, description: 'Compare two JSON objects and highlight differences', tier: 'pro' },
  { name: 'Schema Validator', slug: 'json-schema-validator', icon: Shield, description: 'Validate JSON against a JSON Schema definition', tier: 'pro' },
  { name: 'JSON Viewer', slug: 'json-viewer', icon: Eye, description: 'Navigate complex JSON with an interactive tree view', tier: 'free' },
];

export default function HomePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePrettify = useCallback(() => {
    try {
      const parsed = JSON.parse(input || SAMPLE_JSON);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput('');
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(input || SAMPLE_JSON);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput('');
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    try {
      JSON.parse(input || SAMPLE_JSON);
      setOutput('✓ Valid JSON');
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput('');
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="animate-fade-in">
              <PrivacyBadge className="mb-6" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight mb-4">
                Format, Validate &amp; Transform
                <br />
                <span className="text-accent">JSON Instantly</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-4">
                Free online JSON formatter, validator, minifier and converter.
                All processing happens client-side — your data never leaves your browser.
              </p>
              <p className="text-sm text-text-muted max-w-xl mx-auto mb-8">
                Focused. Private. Efficient. The fastest JSON toolkit for developers.
              </p>
              <div className="flex items-center justify-center gap-4 mb-12">
                <Link
                  href="/tools/json-formatter"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-text-primary rounded-lg font-semibold border border-border hover:border-accent/50 transition-colors"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Interactive Demo Editor */}
            <div className="max-w-5xl mx-auto animate-slide-up">
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-lg">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border bg-surface-elevated">
                  <button
                    onClick={handlePrettify}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> Prettify
                  </button>
                  <button
                    onClick={handleMinify}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface text-text-primary rounded-md text-sm font-medium border border-border hover:border-accent/50 transition-colors"
                  >
                    <Minimize2 className="w-3.5 h-3.5" /> Minify
                  </button>
                  <button
                    onClick={handleValidate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface text-text-primary rounded-md text-sm font-medium border border-border hover:border-accent/50 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Validate
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-text-secondary text-sm hover:text-text-primary transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Split Editor */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  <div className="flex flex-col">
                    <div className="px-3 py-1.5 text-xs text-text-muted border-b border-border bg-primary-dark">
                      Input
                    </div>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={SAMPLE_JSON}
                      className="flex-1 min-h-[300px] p-4 bg-transparent text-text-primary font-mono text-sm resize-none focus:outline-none placeholder:text-text-muted/50"
                      spellCheck={false}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="px-3 py-1.5 text-xs text-text-muted border-b border-border bg-primary-dark">
                      Output
                    </div>
                    <pre className="flex-1 min-h-[300px] p-4 bg-transparent text-text-primary font-mono text-sm overflow-auto whitespace-pre-wrap">
                      {error ? (
                        <span className="text-error">{error}</span>
                      ) : output ? (
                        output
                      ) : (
                        <span className="text-text-muted/50">Output will appear here...</span>
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                All Your JSON Tools in One Place
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Professional-grade tools for formatting, validating, converting, and analyzing JSON data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group relative bg-surface border border-border rounded-xl p-6 hover:border-accent/50 hover:shadow-lg transition-all duration-200"
                  >
                    {tool.tier === 'pro' && (
                      <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
                        Pro
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {tool.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why JSON Prettify */}
        <section className="py-16 md:py-24 bg-surface/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Why Developers Choose JSON Prettify
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Lightning Fast</h3>
                <p className="text-text-secondary text-sm">
                  All processing happens instantly in your browser. No server round-trips, no waiting.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">100% Private</h3>
                <p className="text-text-secondary text-sm">
                  Your data never leaves your browser. Client-side only processing ensures complete privacy.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Works Offline</h3>
                <p className="text-text-secondary text-sm">
                  Once loaded, all tools work without an internet connection. Perfect for secure environments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Ready to Supercharge Your JSON Workflow?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Start with our free tools or upgrade to Pro for advanced features like JSON Diff, Schema Validation, and unlimited file sizes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/tools/json-formatter"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 text-text-secondary hover:text-text-primary transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
        {/* Ad Banner for free users */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AdBanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
