import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "play.go.ai",
  description: "AI golang playground power by friendliAI",
  metadataBase: new URL("https://play-go-ai.vercel.app"),
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen p-20">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
