'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export function TermsPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Terms of Service</h1>
          <p className="text-text-muted text-sm mb-8">Last updated: March 2026</p>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using JSON Prettify, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">2. Description of Service</h2>
              <p>JSON Prettify provides client-side JSON formatting, validation, minification, conversion, and analysis tools. The service is offered in free and paid tiers with different feature sets as described on our pricing page.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">3. User Accounts</h2>
              <p>Some features require creating an account. You are responsible for maintaining the security of your account credentials. You must provide accurate information when creating an account.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">4. Acceptable Use</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to reverse engineer or extract source code</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use automated tools to scrape or access the service beyond normal usage</li>
                <li>Share your Pro/Enterprise account credentials with unauthorized users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">5. Subscription and Billing</h2>
              <p>Paid plans are billed monthly or annually. You may cancel at any time and retain access until the end of your billing period. Refunds are handled on a case-by-case basis. Prices are subject to change with 30 days notice.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">6. Intellectual Property</h2>
              <p>JSON Prettify and its original content, features, and functionality are owned by JSON Prettify and are protected by international copyright and trademark laws. Your JSON data remains your property at all times.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">7. Limitation of Liability</h2>
              <p>JSON Prettify is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from the use or inability to use the service, including data loss or corruption.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">8. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use after changes constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">9. Contact</h2>
              <p>For questions about these terms, please contact us at legal@jsonprettify.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
