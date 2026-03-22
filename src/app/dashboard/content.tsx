'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import {
  FileJson, Users, Key, Settings, Clock, HardDrive, Plus
} from 'lucide-react';

const MOCK_FILES = [
  { name: 'api-response.json', size: '2.4 KB', updated: '2 hours ago' },
  { name: 'config.json', size: '1.1 KB', updated: '1 day ago' },
  { name: 'test-data.json', size: '15.7 KB', updated: '3 days ago' },
];

export function DashboardPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
              <p className="text-text-secondary">Manage your files, team, and settings.</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full">
              Pro Plan
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Saved Files', value: '3 / 200', icon: FileJson },
              { label: 'Storage Used', value: '19.2 KB', icon: HardDrive },
              { label: 'Team Members', value: '1', icon: Users },
              { label: 'API Calls', value: '0 this month', icon: Key },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-surface border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-accent" />
                    <span className="text-sm text-text-secondary">{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Saved Files */}
            <div className="lg:col-span-2">
              <div className="bg-surface border border-border rounded-xl">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h2 className="text-lg font-semibold text-text-primary">Saved Files</h2>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> New File
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {MOCK_FILES.map((file) => (
                    <div key={file.name} className="flex items-center justify-between p-5 hover:bg-surface-elevated transition-colors">
                      <div className="flex items-center gap-3">
                        <FileJson className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{file.name}</p>
                          <p className="text-xs text-text-muted">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="w-3 h-3" /> {file.updated}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: 'Team Settings', icon: Users, href: '#' },
                    { label: 'API Keys', icon: Key, href: '#' },
                    { label: 'Account Settings', icon: Settings, href: '#' },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-3 p-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{action.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Plan Info */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h2 className="text-lg font-semibold text-text-primary mb-2">Your Plan</h2>
                <p className="text-text-secondary text-sm mb-4">
                  Pro plan with 200 saved files, unlimited file size, and all premium tools.
                </p>
                <Link
                  href="/pricing"
                  className="text-sm text-accent hover:underline font-medium"
                >
                  Manage subscription
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
