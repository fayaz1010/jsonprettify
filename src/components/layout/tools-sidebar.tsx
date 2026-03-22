'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wand2,
  CheckCircle,
  Minimize2,
  FileCode,
  Table,
  Code,
  GitCompare,
  Shield,
  Eye,
} from 'lucide-react';

const toolCategories = [
  {
    label: 'Format',
    tools: [
      { name: 'JSON Formatter', href: '/tools/json-formatter', icon: Wand2, pro: false },
      { name: 'JSON Validator', href: '/tools/json-validator', icon: CheckCircle, pro: false },
      { name: 'JSON Minifier', href: '/tools/json-minifier', icon: Minimize2, pro: false },
    ],
  },
  {
    label: 'Convert',
    tools: [
      { name: 'JSON to YAML', href: '/tools/json-to-yaml', icon: FileCode, pro: false },
      { name: 'JSON to CSV', href: '/tools/json-to-csv', icon: Table, pro: false },
      { name: 'JSON to XML', href: '/tools/json-to-xml', icon: Code, pro: false },
    ],
  },
  {
    label: 'Analyze',
    tools: [
      { name: 'JSON Diff', href: '/tools/json-diff', icon: GitCompare, pro: true },
      { name: 'Schema Validator', href: '/tools/json-schema-validator', icon: Shield, pro: true },
      { name: 'JSON Viewer', href: '/tools/json-viewer', icon: Eye, pro: false },
    ],
  },
];

const allTools = toolCategories.flatMap((c) => c.tools);

function ToolsSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-60 shrink-0 border-r border-border bg-surface overflow-y-auto">
        <div className="py-4">
          {toolCategories.map((category) => (
            <div key={category.label} className="mb-4">
              <p className="px-4 text-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
                {category.label}
              </p>
              {category.tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-accent/10 text-accent border-l-2 border-accent'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated border-l-2 border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tool.name}</span>
                    {tool.pro && (
                      <span className="ml-auto text-[10px] font-semibold uppercase bg-accent/20 text-accent px-1.5 py-0.5 rounded">
                        Pro
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile horizontal tabs */}
      <div className="md:hidden w-full border-b border-border bg-surface overflow-x-auto">
        <div className="flex gap-1 px-2 py-2 min-w-max">
          {allTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {tool.name}
                {tool.pro && (
                  <span className="text-[9px] font-semibold uppercase bg-accent/20 text-accent px-1 py-0.5 rounded">
                    Pro
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export { ToolsSidebar };
export default ToolsSidebar;
