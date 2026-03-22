import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/lib/config";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.appUrl),
  title: "JSON Prettify",
  description:
    "Free online JSON formatter, validator, minifier and converter. Paste or upload JSON to prettify with syntax highlighting, validate structure, minify for production, and convert between JSON/YAML/CSV. Fast, private (client-side only), no data sent to servers.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "JSON prettify",
    "JSON minifier",
    "JSON to CSV",
    "JSON to YAML",
    "JSON to XML",
    "JSON diff tool",
    "JSON schema validator",
    "JSON viewer",
  ],
  openGraph: {
    title: "JSON Prettify",
    description:
      "Free online JSON formatter, validator, minifier and converter. Paste or upload JSON to prettify with syntax highlighting, validate structure, minify for production, and convert between JSON/YAML/CSV. Fast, private (client-side only), no data sent to servers.",
    type: "website",
    siteName: "JSON Prettify",
    images: ["/assets/generated/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Prettify",
    description:
      "Free online JSON formatter, validator, minifier and converter. Paste or upload JSON to prettify with syntax highlighting, validate structure, minify for production, and convert between JSON/YAML/CSV. Fast, private (client-side only), no data sent to servers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} dark min-h-full flex flex-col font-sans bg-background text-text-primary`}
      >
        <GoogleAnalytics />
        <ServiceWorkerRegister />
        <SessionProvider>
          <SubscriptionProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </SubscriptionProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
