import Link from 'next/link';
import { api } from '@/lib/api';
import IssueDetailClient from './IssueDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IssueDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let issue = null;
  let error = null;

  try {
    issue = await api.getIssue(id);
  } catch (err) {
    console.error(`Failed to fetch issue ${id}:`, err);
    error = err instanceof Error ? err.message : String(err);
  }

  if (error || !issue) {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        <div className="rounded-[20px] border border-rose-200 bg-rose-50/30 p-8 text-center shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-rose-600/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-base font-semibold text-rose-800">
            Issue Not Found
          </h3>
          <p className="mt-2 text-xs text-rose-700 max-w-md mx-auto leading-relaxed">
            {error ||
              `The issue with ID "${id}" could not be retrieved. It may have been deleted or the backend database is unreachable.`}
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-all active:scale-95"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <IssueDetailClient initialIssue={issue} />;
}
