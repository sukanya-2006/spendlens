
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — Free AI Spend Audit",
  description: "Find out where you're overpaying on AI tools. Free audit for startups.",
  openGraph: {
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out where you're overpaying on AI tools. Free audit for startups.",
    url: "https://spendlens-taupe-eight.vercel.app",
    siteName: "SpendLens",
  },
  twitter: {
    card: "summary",
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out where you're overpaying on AI tools.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
