'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Check, X, Sparkles } from 'lucide-react';
import { FREE_TIER, PRO_TIER } from '@/lib/config';

const TIERS = [
  {
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    period: '/mo',
    description: 'Essential JSON tools for everyday use.',
    features: [
      { text: 'Core formatting/validation/minification', included: true },
      { text: 'Basic conversions (CSV, XML, YAML)', included: true },
      { text: 'Syntax highlighting & tree view', included: true },
      { text: 'File upload & download', included: true },
      { text: 'Fetch JSON from URL', included: true },
      { text: 'Ad-supported', included: true },
      { text: '1MB file size limit', included: true },
      { text: 'Up to 5 saved files', included: true },
      { text: 'JSON Diff tool', included: false },
      { text: 'JSON Schema validation', included: false },
      { text: 'Priority processing', included: false },
    ],
    cta: 'Get Started Free',
    ctaHref: '/tools/json-formatter',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: { monthly: '$7', annual: '$5.60' },
    period: '/mo',
    description: 'Advanced tools for professional developers.',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Up to 200 saved/shared files', included: true },
      { text: 'Unlimited file size', included: true },
      { text: 'JSON Diff tool', included: true },
      { text: 'JSON Schema validation', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Advanced export options', included: true },
      { text: 'TOML & BSON conversion', included: true },
      { text: 'Cloud storage integration', included: true },
      { text: 'Customizable themes', included: true },
    ],
    cta: 'Start Free Trial',
    ctaHref: '/signup',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: '$120', annual: '$96' },
    period: '/mo',
    description: 'Complete solution for development teams.',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited premium accounts for team', included: true },
      { text: 'Shared cloud workspace', included: true },
      { text: 'API access', included: true },
      { text: 'Priority email support', included: true },
      { text: 'White-label options', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'SSO / SAML authentication', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'On-premise deployment option', included: true },
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact',
    highlighted: false,
  },
];

const FAQ = [
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! You get a 14-day free trial of Pro with full access to all features. No credit card required.',
  },
  {
    q: 'Can I switch plans at any time?',
    a: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.',
  },
  {
    q: 'Is my data safe?',
    a: 'All JSON processing happens client-side in your browser. Your data never touches our servers. We take privacy seriously.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
  },
  {
    q: 'Do you offer discounts for students or open source?',
    a: 'Yes! Contact us for special pricing for students, educators, and open-source maintainers.',
  },
];

export function PricingPageContent() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
                Start free, upgrade when you need more power. All plans include our core JSON tools.
              </p>

              {/* Annual/Monthly Toggle */}
              <div className="inline-flex items-center gap-3 bg-surface rounded-full p-1 border border-border">
                <button
                  onClick={() => setAnnual(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !annual ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    annual ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Annual
                </button>
                {!annual && (
                  <span className="text-xs text-success font-medium pr-3">Save 20%</span>
                )}
              </div>
              {annual && (
                <p className="mt-3 text-sm text-success font-medium">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Save 20% with an annual plan
                </p>
              )}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative bg-surface rounded-2xl p-8 border ${
                    tier.highlighted
                      ? 'border-accent shadow-lg shadow-accent/10 scale-105'
                      : 'border-border'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-text-primary mb-2">{tier.name}</h3>
                  <p className="text-text-secondary text-sm mb-4">{tier.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-text-primary">
                      {annual ? tier.price.annual : tier.price.monthly}
                    </span>
                    <span className="text-text-muted">{tier.period}</span>
                    {annual && tier.name !== 'Free' && (
                      <span className="block text-xs text-text-muted mt-1">
                        billed annually
                      </span>
                    )}
                  </div>

                  <Link
                    href={tier.ctaHref}
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors mb-8 ${
                      tier.highlighted
                        ? 'bg-accent text-white hover:bg-blue-600'
                        : 'bg-surface-elevated text-text-primary border border-border hover:border-accent/50'
                    }`}
                  >
                    {tier.cta}
                  </Link>

                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-text-secondary text-sm' : 'text-text-muted text-sm'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-surface/50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQ.map((item, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{item.q}</h3>
                  <p className="text-text-secondary">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
