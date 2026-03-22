'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  X,
  ChevronDown,
  Wand2,
  CheckCircle,
  Minimize2,
  FileCode,
  Table,
  Code,
  GitCompare,
  Shield,
  Eye,
  Sparkles,
  LogOut,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useSubscription } from '@/context/SubscriptionContext';

const toolCategories = [
  {
    label: 'Format',
    tools: [
      { name: 'JSON Formatter', href: '/tools/json-formatter', icon: Wand2 },
      { name: 'JSON Validator', href: '/tools/json-validator', icon: CheckCircle },
      { name: 'JSON Minifier', href: '/tools/json-minifier', icon: Minimize2 },
    ],
  },
  {
    label: 'Convert',
    tools: [
      { name: 'JSON to YAML', href: '/tools/json-to-yaml', icon: FileCode },
      { name: 'JSON to CSV', href: '/tools/json-to-csv', icon: Table },
      { name: 'JSON to XML', href: '/tools/json-to-xml', icon: Code },
    ],
  },
  {
    label: 'Analyze',
    tools: [
      { name: 'JSON Diff', href: '/tools/json-diff', icon: GitCompare },
      { name: 'Schema Validator', href: '/tools/json-schema-validator', icon: Shield },
      { name: 'JSON Viewer', href: '/tools/json-viewer', icon: Eye },
    ],
  },
];

function Navbar() {
  const { data: session } = useSession();
  const { isProUser } = useSubscription();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-primary-dark/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 text-text-primary font-bold text-lg">
          <span className="text-accent font-mono text-xl">{'{}'}</span>
          <span>JSON Prettify</span>
        </Link>

        {/* Center: Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Tools dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onMouseEnter={() => setToolsOpen(true)}
              className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
            >
              Tools
              <ChevronDown className={`w-4 h-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsOpen && (
              <div
                onMouseLeave={() => setToolsOpen(false)}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-surface-elevated border border-border rounded-lg shadow-xl p-4 animate-fade-in"
              >
                {toolCategories.map((category) => (
                  <div key={category.label} className="mb-3 last:mb-0">
                    <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
                      {category.label}
                    </p>
                    {category.tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors text-sm"
                        >
                          <Icon className="w-4 h-4" />
                          {tool.name}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/features" className="text-text-secondary hover:text-text-primary transition-colors">
            Features
          </Link>
        </div>

        {/* Right: Theme toggle, auth & CTA (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-elevated"
              >
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm">{session.user.email?.split('@')[0]}</span>
                {isProUser && (
                  <span className="text-[10px] font-semibold uppercase bg-accent/20 text-accent px-1.5 py-0.5 rounded">
                    Pro
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-elevated border border-border rounded-lg shadow-xl p-2 animate-fade-in">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  {!isProUser && (
                    <Link
                      href="/pricing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-accent hover:bg-surface transition-colors text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      Upgrade to Pro
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors text-sm w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Upgrade to Pro
              </Link>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-secondary hover:text-text-primary"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-primary-dark/95 backdrop-blur-lg overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            {/* Tools grouped */}
            {toolCategories.map((category) => (
              <div key={category.label}>
                <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                  {category.label}
                </p>
                <div className="space-y-1">
                  {category.tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-4 space-y-1">
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-text-secondary hover:text-text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/features"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-text-secondary hover:text-text-primary transition-colors"
              >
                Features
              </Link>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-text-secondary text-sm">Theme</span>
                <ThemeToggle />
              </div>
              {session?.user ? (
                <>
                  <div className="px-3 py-2 text-text-primary text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    {session.user.email}
                    {isProUser && (
                      <span className="text-[10px] font-semibold uppercase bg-accent/20 text-accent px-1.5 py-0.5 rounded">Pro</span>
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-2.5 text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full text-center px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Pro
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export { Navbar };
export default Navbar;
