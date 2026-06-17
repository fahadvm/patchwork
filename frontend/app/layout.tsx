import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Patchwork — Issue Tracker & AI Analyst',
  description: 'Manage issues, discuss bugs, and run AI analyses powered by Gemini.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fdf6ed] text-[#2b332a] font-sans selection:bg-[#a1bc98]/40 selection:text-[#2b332a]">
        {/* Decorative background gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(119,136,115,0.08)_0,transparent_60%)] blur-3xl" />
          <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(119,136,115,0.04)_0,transparent_50%)] blur-2xl" />
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 w-full border-b border-card-border bg-[#fdf6ed]/85 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-serif font-bold text-2xl tracking-tight text-[#2b332a] hover:text-[#778873] transition-colors">
                  Patchwork
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#778873] animate-pulse mt-2" />
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-[#2b332a]/70 hover:text-[#778873] transition-colors"
                >
                  Home
                </Link>

                <Link
                  href="/issues"
                  className="text-sm font-medium text-[#2b332a]/70 hover:text-[#778873] transition-colors"
                >
                  Issues
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-[#2b332a]/70 hover:text-[#778873] transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>
            <div>
              <Link
                href="/issues/new"
                className="inline-flex items-center justify-center rounded-lg bg-[#778873] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#a1bc98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#778873] transition-all duration-200 active:scale-95"
              >
                + New Issue
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-card-border bg-white py-6 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Patchwork Inc. Powered by Gemini 1.5 Flash.</p>
        </footer>
      </body>
    </html>
  );
}
