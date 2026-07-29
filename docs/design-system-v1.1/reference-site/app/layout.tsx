import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DutchMate Design System",
  description:
    "The complete brand, product UI, learning patterns, and implementation reference for DutchMate.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
