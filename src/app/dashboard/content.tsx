'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useSubscription } from '@/context/SubscriptionContext';
import {
  FileJson, Users, Key, Settings, Clock, HardDrive, Plus, Loader2, Trash2
} from 'lucide-react';

interface SavedFile {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  updatedAt: string;
}

export function DashboardPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isProUser, refreshSubscription } = useSubscription();
  const searchParams = useSearchParams();
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [fileLimit, setFileLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      refreshSubscription();
    }
  }, [searchParams, refreshSubscription]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    async function fetchFiles() {
      try {
        const res = await fetch('/api/files', {
          headers: { Authorization: 'Bearer mock-token' },
        });
        const data = await res.json();
        if (data.success) {
          setFiles(data.files || []);
          setFileLimit(data.limit || (isProUser ? 200 : 5));
        }
      } catch {
        // Silently fail for mock API
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, [status, isProUser]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = await res.json();
      if (data.success) {
        setFiles((prev: SavedFile[]) => prev.filter((f: SavedFile) => f.id !== fileId));
      }
    } catch {
      // Silently fail for mock API
    }
  }, []);

  const handleSaveFile = useCallback(async () => {
    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify({
          name: `file-${Date.now()}.json`,
          content: '{"example": true}',
        }),
      });
      const data = await res.json();
      if (data.success && data.file) {
        setFiles((prev: SavedFile[]) => [...prev, data.file]);
      } else if (data.error) {
        alert(data.error);
      }
    } catch {
      // Silently fail for mock API
    }
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const maxFiles = isProUser ? 200 : fileLimit;
  const totalSize = files.reduce((acc: number, f: SavedFile) => {
    const match = f.size.match(/^([\d.]+)/);
    return acc + (match ? parseFloat(match[1]) : 0);
  }, 0);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
              <p className="text-text-secondary">Welcome back, {session.user.email?.split('@')[0]}.</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              isProUser ? 'bg-accent/10 text-accent' : 'bg-surface-elevated text-text-secondary border border-border'
            }`}>
              {isProUser ? 'Pro Plan' : 'Free Plan'}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Saved Files', value: `${files.length} / ${maxFiles}`, icon: FileJson },
              { label: 'Storage Used', value: `${totalSize.toFixed(1)} KB`, icon: HardDrive },
              { label: 'Plan', value: isProUser ? 'Pro' : 'Free', icon: Users },
              { label: 'File Size Limit', value: isProUser ? 'Unlimited' : '1 MB', icon: Key },
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
                  <button
                    onClick={handleSaveFile}
                    disabled={files.length >= maxFiles}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" /> New File
                  </button>
                </div>
                {files.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileJson className="w-10 h-10 text-text-muted mx-auto mb-3" />
                    <p className="text-text-secondary text-sm">No saved files yet. Start by saving a file from one of the tools.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-5 hover:bg-surface-elevated transition-colors">
                        <div className="flex items-center gap-3">
                          <FileJson className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-sm font-medium text-text-primary">{file.name}</p>
                            <p className="text-xs text-text-muted">{file.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <Clock className="w-3 h-3" /> {timeAgo(file.updatedAt)}
                          </span>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1.5 text-text-muted hover:text-error transition-colors rounded"
                            aria-label="Delete file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: 'JSON Formatter', icon: FileJson, href: '/tools/json-formatter' },
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
                {isProUser ? (
                  <p className="text-text-secondary text-sm mb-4">
                    Pro plan with {maxFiles} saved files, unlimited file size, and all premium tools.
                  </p>
                ) : (
                  <p className="text-text-secondary text-sm mb-4">
                    Free plan with {maxFiles} saved files and 1MB file size limit. Upgrade to Pro for more.
                  </p>
                )}
                <Link
                  href="/pricing"
                  className="text-sm text-accent hover:underline font-medium"
                >
                  {isProUser ? 'Manage subscription' : 'Upgrade to Pro'}
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
