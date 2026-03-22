'use client';

import Link from 'next/link';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'JSON Formatter', href: '/tools/json-formatter' },
      { label: 'JSON Validator', href: '/tools/json-validator' },
      { label: 'JSON Minifier', href: '/tools/json-minifier' },
      { label: 'JSON Viewer', href: '/tools/json-viewer' },
    ],
  },
  {
    title: 'Converters',
    links: [
      { label: 'JSON to YAML', href: '/tools/json-to-yaml' },
      { label: 'JSON to CSV', href: '/tools/json-to-csv' },
      { label: 'JSON to XML', href: '/tools/json-to-xml' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Features', href: '/features' },
      { label: 'About', href: '/features' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-text-primary font-semibold text-sm mb-3">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-muted hover:text-text-secondary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} JSON Prettify. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Trusted by 500K+ developers &middot; Fast, private, client-side only.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
export default Footer;
