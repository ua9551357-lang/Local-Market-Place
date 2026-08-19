import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { AuthHydration } from "@/components/layout/AuthHydration";
import { VoiceWidget } from "@/components/voice/VoiceWidget";
import { Toaster } from 'sonner';
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LocalMarket — AI Powered Local Marketplace",
  description: "Find trusted local services or offer your skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
     <body className="font-sans bg-neutral-100 text-neutral-900">
  <QueryProvider>
  <AuthHydration>
    {children}
    <VoiceWidget />
    <Toaster position="top-right" richColors />
  </AuthHydration>
</QueryProvider>
</body>
    </html>
  );
}