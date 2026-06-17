'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NewIssuePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createIssue({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to create issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      {/* Back to dashboard link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2b332a]/60 hover:text-[#778873] transition-colors group"
        >
          <svg
            className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Main card */}
      <div className="rounded-[20px] border border-card-border bg-white p-6 sm:p-8 shadow-sm">
        <div className="border-b border-neutral-100 pb-5 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#778873] mb-2 block">
            Add New Ticket
          </span>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2b332a] leading-tight">
            Create New Issue
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Fill out the details below to open a new issue ticket.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 mb-6">
            <div className="flex gap-2">
              <svg
                className="h-5 w-5 text-rose-600 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-rose-700 font-semibold">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title input */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Issue Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken authentication on registration form"
              disabled={isSubmitting}
              className="block w-full rounded-lg border border-card-border bg-[#fdf6ed]/40 px-4 py-2.5 text-sm text-[#2b332a] placeholder:text-neutral-400 focus:border-[#778873] focus:outline-none focus:ring-1 focus:ring-[#778873] disabled:opacity-50"
              required
            />
          </div>

          {/* Description input */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a clear, detailed description of the bug or feature request, including replication steps..."
              disabled={isSubmitting}
              className="block w-full rounded-lg border border-card-border bg-[#fdf6ed]/40 px-4 py-2.5 text-sm text-[#2b332a] placeholder:text-neutral-400 focus:border-[#778873] focus:outline-none focus:ring-1 focus:ring-[#778873] disabled:opacity-50"
              required
            />
          </div>

          {/* Dropdowns row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Status select */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Initial Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
                className="block w-full rounded-lg border border-card-border bg-[#fdf6ed]/40 px-4 py-2.5 text-sm text-neutral-800 focus:border-[#778873] focus:outline-none focus:ring-1 focus:ring-[#778873] disabled:opacity-50"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority select */}
            <div className="space-y-1.5">
              <label htmlFor="priority" className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isSubmitting}
                className="block w-full rounded-lg border border-card-border bg-[#fdf6ed]/40 px-4 py-2.5 text-sm text-neutral-800 focus:border-[#778873] focus:outline-none focus:ring-1 focus:ring-[#778873] disabled:opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4 border-t border-neutral-100 pt-6 mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-card-border bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-[#fdf6ed]/50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-[#778873] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#a1bc98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#778873] transition-all duration-200 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Issue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
