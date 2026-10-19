import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'Mei-Kaappan — Intelligent Scam Prevention & Protection System',
  description:
    'Proactive cybersecurity platform correlating suspicious messages, URLs, UPI payment checks, and device exposures into explainable scam journey narratives.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-cyan-500 selection:text-white transition-colors duration-150">
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
