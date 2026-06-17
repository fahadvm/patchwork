import { api, Issue } from '@/lib/api';
import IssueListClient from '../IssueListClient';

export const dynamic = 'force-dynamic';

export default async function IssuesPage() {
  let issues: Issue[] = [];
  let error: string | null = null;

  try {
    issues = await api.getIssues();
  } catch (err) {
    console.error('Failed to fetch issues:', err);
    error = err instanceof Error ? err.message : String(err);
  }

  return (
    <div className="w-full">
      {error ? (
        <div className="max-w-xl mx-auto mt-16 text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto h-16 w-16 rounded-2xl bg-[#778873]/10 flex items-center justify-center">
            <svg className="h-8 w-8 text-[#778873]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
            </svg>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#2b332a]">Backend is offline</h2>
            <p className="text-sm text-neutral-500 leading-relaxed">
              The backend service isn&apos;t reachable right now. Start it using one of the methods below.
            </p>
          </div>

          {/* Steps */}
          <div className="rounded-xl border border-card-border bg-white p-5 text-left shadow-sm space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#778873]">Quick Start</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-[#778873]/15 text-[#778873] text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="text-xs font-semibold text-[#2b332a]">Using Docker (recommended)</p>
                  <code className="text-xs text-neutral-500 font-mono">docker-compose up</code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-[#778873]/15 text-[#778873] text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="text-xs font-semibold text-[#2b332a]">Or run backend manually</p>
                  <code className="text-xs text-neutral-500 font-mono">cd backend &amp;&amp; npm run start:dev</code>
                </div>
              </div>
            </div>
          </div>

          <a
            href="/issues"
            className="inline-flex items-center justify-center rounded-lg bg-[#778873] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#a1bc98] transition-all active:scale-95"
          >
            Retry Connection
          </a>
        </div>
      ) : (
        <IssueListClient initialIssues={issues} />
      )}
    </div>
  );
}
