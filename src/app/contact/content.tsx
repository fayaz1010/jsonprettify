'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Mail, MessageSquare, Send } from 'lucide-react';

export function ContactPageContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), subject, message: message.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
            <p className="text-lg text-text-secondary">
              Have a question, feedback, or need support? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-surface border border-border rounded-xl p-6 text-center">
              <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold text-text-primary mb-1">Email</h3>
              <p className="text-text-secondary text-sm">support@jsonprettify.com</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 text-center">
              <MessageSquare className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold text-text-primary mb-1">Response Time</h3>
              <p className="text-text-secondary text-sm">Within 24 hours</p>
            </div>
          </div>

          {status === 'success' ? (
            <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-8 text-center">
              <p className="text-[#22C55E] font-semibold text-lg mb-2">Message Sent!</p>
              <p className="text-text-secondary">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 space-y-6">
              {status === 'error' && errorMessage && (
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-4">
                  <p className="text-[#EF4444] text-sm font-medium">{errorMessage}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing Question">Billing Question</option>
                  <option value="Enterprise Sales">Enterprise Sales</option>
                  <option value="Feedback">Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-primary-dark border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
