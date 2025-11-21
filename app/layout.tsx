import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * SEO Metadata for your project
 */
export const metadata: Metadata = {
  title: "PulseTags – AI Hashtag Generator",
  description:
    "Generate smart, platform-aware hashtags with explanations, viral scores, and multi-language support. Perfect for Instagram, TikTok, YouTube, Twitter/X, Pinterest, and more.",

  metadataBase: new URL("https://pulsetags.netlify.app"),

  openGraph: {
    title: "PulseTags – AI Hashtag Generator",
    description:
      "Generate platform-optimized hashtags with viral scores, explanations, and multi-language support.",
    url: "https://your-domain.com",
    siteName: "PulseTags",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PulseTags – AI Hashtag Generator",
    description:
      "Generate smart hashtags with viral scores and explanations for social media growth.",
  },
};

/**
 * Root Layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
