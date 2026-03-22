import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jsonprettify.com"),
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
        {children}
      </body>
    </html>
  );
}
