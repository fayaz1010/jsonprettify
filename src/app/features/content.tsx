'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import {
  Wand2, CheckCircle, Minimize2, FileCode, Table, Code,
  GitCompare, Shield, Eye, Upload, Download, Globe, Copy,
  Palette, Search, FolderOpen, Zap
} from 'lucide-react';

const FEATURE_GROUPS = [
  {
    title: 'Core Tools',
    description: 'Free for everyone',
    features: [
      { icon: Wand2, name: 'JSON Formatting', desc: 'Beautify JSON with customizable 2 or 4-space indentation and syntax highlighting.', tier: 'free', link: '/tools/json-formatter' },
      { icon: CheckCircle, name: 'JSON Validation', desc: 'Validate JSON syntax with precise error messages showing line and column numbers.', tier: 'free', link: '/tools/json-validator' },
      { icon: Minimize2, name: 'JSON Minification', desc: 'Compact JSON by removing all whitespace, reducing file size for production.', tier: 'free', link: '/tools/json-minifier' },
      { icon: Eye, name: 'JSON Viewer', desc: 'Navigate complex nested JSON with an interactive, collapsible tree view.', tier: 'free', link: '/tools/json-viewer' },
      { icon: Copy, name: 'Copy to Clipboard', desc: 'One-click copy of processed output to your clipboard.', tier: 'free' },
      { icon: Upload, name: 'File Upload', desc: 'Upload .json files directly or drag and drop into the editor.', tier: 'free' },
      { icon: Download, name: 'File Download', desc: 'Download processed JSON output as a file.', tier: 'free' },
      { icon: Globe, name: 'Fetch from URL', desc: 'Load JSON directly from any public API endpoint or URL.', tier: 'free' },
    ],
  },
  {
    title: 'Converters',
    description: 'Transform JSON to other formats',
    features: [
      { icon: FileCode, name: 'JSON to YAML', desc: 'Convert JSON to human-readable YAML format for configuration files.', tier: 'free', link: '/tools/json-to-yaml' },
      { icon: Table, name: 'JSON to CSV', desc: 'Transform JSON arrays into CSV for spreadsheets and data analysis.', tier: 'free', link: '/tools/json-to-csv' },
      { icon: Code, name: 'JSON to XML', desc: 'Convert JSON objects to well-formed XML documents.', tier: 'free', link: '/tools/json-to-xml' },
      { icon: FileCode, name: 'TOML & BSON', desc: 'Convert to TOML and BSON formats for specialized use cases.', tier: 'pro' },
    ],
  },
  {
    title: 'Pro Tools',
    description: 'Advanced capabilities for power users',
    features: [
      { icon: GitCompare, name: 'JSON Diff', desc: 'Compare two JSON objects side-by-side with color-coded differences.', tier: 'pro', link: '/tools/json-diff' },
      { icon: Shield, name: 'Schema Validation', desc: 'Validate JSON against a JSON Schema definition with detailed error reports.', tier: 'pro', link: '/tools/json-schema-validator' },
      { icon: Palette, name: 'Custom Themes', desc: 'Switch between light, dark, and high-contrast themes.', tier: 'pro' },
      { icon: Search, name: 'Find & Replace', desc: 'Advanced search with regex support and bulk replace in the editor.', tier: 'pro' },
      { icon: FolderOpen, name: 'Saved Files', desc: 'Save up to 200 files and share them with your team.', tier: 'pro' },
      { icon: Zap, name: 'Priority Processing', desc: 'Faster processing for large JSON files with no size limits.', tier: 'pro' },
    ],
  },
];

export function FeaturesPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Everything You Need for JSON
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A complete toolkit for formatting, validating, converting, and analyzing JSON data.
              All processing happens client-side for maximum privacy and speed.
            </p>
          </div>

          {FEATURE_GROUPS.map((group) => (
            <div key={group.title} className="mb-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">{group.title}</h2>
                <p className="text-text-secondary">{group.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.features.map((feature) => {
                  const Icon = feature.icon;
                  const content = (
                    <div className="group bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all relative">
                      {feature.tier === 'pro' && (
                        <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
                          Pro
                        </span>
                      )}
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.name}</h3>
                      <p className="text-text-secondary text-sm">{feature.desc}</p>
                    </div>
                  );
                  return feature.link ? (
                    <Link key={feature.name} href={feature.link}>{content}</Link>
                  ) : (
                    <div key={feature.name}>{content}</div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="text-center mt-16">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
