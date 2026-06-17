'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Issue } from '../lib/api';

interface IssueListClientProps {
  initialIssues: Issue[];
}

export default function IssueListClient({ initialIssues }: IssueListClientProps) {
  const [issues] = useState<Issue[]>(initialIssues);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter logic
  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  // Calculate statistics
  const totalCount = issues.length;
  const openCount = issues.filter((i) => i.status === 'open').length;
  const inProgressCount = issues.filter((i) => i.status === 'in-progress').length;
  const closedCount = issues.filter((i) => i.status === 'closed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Open
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-[#778873] bg-[#a1bc98]/20 px-2 py-0.5 rounded">
            In Progress
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
            Medium Priority
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-[#dccfc0]/30 px-2 py-0.5 rounded">
            Low Priority
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-12">

      {/* Centered Heading with Sage Underline - Scroll Anchor Target */}
      <div id="issues-list" className="text-center py-4 scroll-mt-20">
        <h2 className="font-serif text-4xl font-bold text-[#2b332a] relative inline-block">
          Issues Dashboard
          <span className="absolute bottom-[-10px] left-1/4 right-1/4 h-[3px] bg-primary-sage rounded-full" />
        </h2>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Issues', count: totalCount, border: 'border-card-border' },
          { label: 'Open', count: openCount, border: 'border-emerald-200 text-emerald-800 bg-emerald-50/20' },
          { label: 'In Progress', count: inProgressCount, border: 'border-[#a1bc98] text-[#778873] bg-[#a1bc98]/10' },
          { label: 'Closed', count: closedCount, border: 'border-card-border text-neutral-500 bg-neutral-50/20' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border bg-white p-5 shadow-sm ${stat.border}`}
          >
            <p className="text-xs font-semibold text-neutral-550 uppercase tracking-wider">{stat.label}</p>
            <p className="mt-2 text-3xl font-serif font-bold text-[#2b332a] tracking-tight">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border border-card-border bg-white p-5 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Status filter select */}
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <label htmlFor="status-filter" className="text-xs font-semibold text-neutral-500">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm text-neutral-800 focus:border-primary-sage focus:outline-none focus:ring-1 focus:ring-primary-sage"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority filter select */}
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <label htmlFor="priority-filter" className="text-xs font-semibold text-neutral-500">
              Filter by Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="block w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm text-neutral-800 focus:border-primary-sage focus:outline-none focus:ring-1 focus:ring-primary-sage"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-neutral-505">
          Showing <span className="font-semibold text-[#2b332a]">{filteredIssues.length}</span> of{' '}
          <span className="font-semibold text-[#2b332a]">{issues.length}</span> issues
        </div>
      </div>

      {/* Issues list rendering (2-column layout matching projects styling) */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-card-border rounded-xl bg-white shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-neutral-700">No issues found</h3>
          <p className="mt-1 text-xs text-neutral-450">
            Adjust your filters or create a new issue to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in-up">
          {filteredIssues.map((issue, index) => (
            <div
              key={issue.id}
              className={`bg-white rounded-[20px] border border-card-border overflow-hidden shadow-sm hover:shadow-md hover:border-[#778873] transition-all duration-300 flex flex-col md:flex-row min-h-[260px] ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Left text column (60%) */}
              <div className="p-8 md:w-[60%] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(issue.status)}
                    {getPriorityBadge(issue.priority)}
                    <span className="text-[11px] text-neutral-400 font-medium ml-auto">
                      {formatDate(issue.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#2b332a] hover:text-[#778873] transition-colors leading-snug">
                      <Link href={`/issues/${issue.id}`}>
                        {issue.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                    <svg
                      className="h-4 w-4 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{issue.commentCount || 0} Comments</span>
                  </span>

                  <Link
                    href={`/issues/${issue.id}`}
                    className="inline-flex items-center justify-center rounded-full border-2 border-[#778873] px-5 py-2 text-xs font-semibold text-[#778873] hover:bg-[#778873] hover:text-white transition-all duration-200"
                  >
                    View Issue
                  </Link>
                </div>
              </div>

              {/* Right image column (40%) */}
              <div className="relative md:w-[40%] min-h-[180px] md:min-h-full bg-neutral-50 flex items-center justify-center overflow-hidden border-t md:border-t-0 md:border-l border-neutral-100">
                <img
                  src="/card_illustration.png"
                  alt="Issue metrics illustration"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Sage Green overlay screen */}
                <div className="absolute inset-0 bg-[#778873]/5 mix-blend-multiply" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
