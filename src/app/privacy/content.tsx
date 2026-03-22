'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Shield } from 'lucide-react';

export function PrivacyPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Privacy Policy</h1>
          </div>
          <p className="text-text-muted text-sm mb-8">Last updated: March 2026</p>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <div className="bg-success/5 border border-success/20 rounded-xl p-6">
              <p className="text-success font-semibold text-lg mb-2">Our Core Promise</p>
              <p>Fast, private (client-side only), no data sent to servers. All JSON processing happens entirely in your browser. Your data never leaves your device.</p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">1. Client-Side Processing</h2>
              <p>JSON Prettify is designed with privacy as a fundamental principle. All JSON formatting, validation, minification, conversion, and analysis operations are performed entirely within your web browser using JavaScript. No JSON data you input, paste, upload, or process is ever transmitted to our servers or any third-party service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">2. Data We Collect</h2>
              <p className="mb-3">We collect minimal data necessary to provide and improve our service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-text-primary">Account information</strong> (Pro/Enterprise users only): Email address and password hash for authentication.</li>
                <li><strong className="text-text-primary">Usage analytics</strong>: Anonymous, aggregated usage statistics (e.g., which tools are most popular) to improve the product. No personally identifiable information or JSON content is included.</li>
                <li><strong className="text-text-primary">Saved files</strong> (Pro/Enterprise users only): If you choose to save files to your account, they are stored encrypted on our servers. You can delete them at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">3. Data We Do NOT Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>JSON data you input into our tools (free tier)</li>
                <li>File contents you upload for processing</li>
                <li>URLs you fetch JSON from</li>
                <li>Your clipboard contents</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">4. Cookies</h2>
              <p>We use essential cookies for authentication (Pro/Enterprise users) and anonymous analytics. We do not use tracking cookies or share data with advertisers. Free tier ads are served by privacy-respecting ad networks.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">5. Third-Party Services</h2>
              <p>We may use privacy-respecting analytics services to understand aggregate usage patterns. These services do not have access to your JSON data or personal information beyond what is necessary for analytics.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">6. Data Security</h2>
              <p>All communications with our servers (for authentication and file storage) use TLS encryption. Saved files are encrypted at rest. We follow industry best practices for security.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">7. Your Rights</h2>
              <p>You have the right to access, modify, or delete your account data at any time. Contact us at privacy@jsonprettify.com for any privacy-related requests.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">8. Contact</h2>
              <p>For any questions about this privacy policy, please contact us at privacy@jsonprettify.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
