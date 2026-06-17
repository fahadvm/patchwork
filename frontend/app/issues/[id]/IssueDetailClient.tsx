'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, Issue, Comment, parseAiAnalysis } from '@/lib/api';

interface IssueDetailClientProps {
  initialIssue: Issue;
}

export default function IssueDetailClient({ initialIssue }: IssueDetailClientProps) {
  const [issue, setIssue] = useState<Issue>(initialIssue);
  const [comments, setComments] = useState<Comment[]>(initialIssue.comments || []);
  const [authorName, setAuthorName] = useState('');
  const [commentBody, setCommentBody] = useState('');

  // Loading/Operation states
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [updatingField, setUpdatingField] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Parse the current latest analysis
  const currentAnalysis = issue.latestAnalysis
    ? parseAiAnalysis(issue.latestAnalysis.summary)
    : null;

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Field updates (status & priority)
  const handleFieldChange = async (field: 'status' | 'priority', value: string) => {
    setUpdatingField(field);
    try {
      const updated = await api.updateIssue(issue.id, { [field]: value });
      setIssue((prev) => ({
        ...prev,
        [field]: updated[field],
        updatedAt: updated.updatedAt,
      }));
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
      alert(`Error updating ${field}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUpdatingField(null);
    }
  };

  // Add a new comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentBody.trim()) {
      setCommentError('Both Name and Comment are required.');
      return;
    }

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const newComment = await api.addComment(issue.id, {
        authorName: authorName.trim(),
        body: commentBody.trim(),
      });
      setComments((prev) => [...prev, newComment]);
      setCommentBody('');
      // Update issue timestamp locally
      setIssue((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
      }));
    } catch (err) {
      console.error('Failed to add comment:', err);
      setCommentError(err instanceof Error ? err.message : 'Failed to add comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Trigger Gemini AI Analysis
  const handleTriggerAnalysis = async () => {
    setIsAnalyzing(true);
    setAiError(null);

    try {
      const newAnalysis = await api.triggerAiAnalysis(issue.id);
      setIssue((prev) => ({
        ...prev,
        latestAnalysis: newAnalysis,
      }));
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
      setAiError(err instanceof Error ? err.message : 'AI Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Badge utility colors matching Sage Green Palette
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in-progress':
        return 'bg-[#a1bc98]/20 text-[#778873] border border-[#a1bc98]/30';
      case 'closed':
        return 'bg-neutral-50 text-neutral-500 border-neutral-200';
      default:
        return 'bg-neutral-50 text-neutral-500 border-neutral-250';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'low':
        return 'bg-neutral-50 text-neutral-600 border border-[#dccfc0]/40';
      default:
        return 'bg-neutral-50 text-neutral-500 border-neutral-250';
    }
  };

  // Dynamic sentiment pill styles
  const getSentimentPillClass = (sentiment: string) => {
    const s = sentiment?.toLowerCase() || '';
    if (s.includes('positive') || s.includes('good') || s.includes('happy')) {
      return 'bg-emerald-50 text-emerald-800 ring-emerald-500/20';
    } else if (s.includes('negative') || s.includes('bad') || s.includes('frustrat') || s.includes('angry')) {
      return 'bg-rose-50 text-rose-800 ring-rose-500/20';
    }
    return 'bg-amber-50 text-amber-805 ring-amber-500/20';
  };

  return (
    <div className="space-y-8">
      {/* Back and breadcrumbs header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
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

        {updatingField && (
          <span className="text-xs text-neutral-500 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-card-border shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#778873] animate-ping" />
            Saving changes...
          </span>
        )}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Issue Description & Comments */}
        <div className="lg:col-span-2 space-y-8">
          {/* Issue Header and Description Card */}
          <div className="rounded-[20px] border border-card-border bg-white p-6 sm:p-8 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#778873] mb-2 block">
              Issue Ticket
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2b332a] leading-tight">
              {issue.title}
            </h1>

            {/* Description */}
            <div className="mt-6 border-t border-neutral-100 pt-6">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Description
              </h3>
              <p className="mt-3 text-neutral-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>
          </div>

          {/* Comments Discussion Thread */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#2b332a] flex items-center gap-2">
              Discussion
              <span className="rounded-full bg-white border border-card-border px-2.5 py-0.5 text-xs text-[#2b332a]/60 font-semibold shadow-sm">
                {comments.length}
              </span>
            </h2>

            {/* Comment list */}
            {comments.length === 0 ? (
              <div className="rounded-xl border border-card-border bg-white p-6 text-center text-sm text-neutral-400 shadow-sm">
                No comments posted yet. Start the conversation below.
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex flex-col gap-2 rounded-xl border border-card-border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-[#778873]/15 text-[#778873] flex items-center justify-center font-bold text-xs border border-[#778873]/20">
                          {comment.authorName[0]?.toUpperCase() || '?'}
                        </span>
                        <span className="text-xs font-semibold text-[#2b332a]">
                          {comment.authorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed pl-8 whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Form */}
            <div className="rounded-xl border border-card-border bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-800 mb-4">Add Comment</h3>
              {commentError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 mb-4 text-xs text-rose-700">
                  {commentError}
                </div>
              )}
              <form onSubmit={handleAddComment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      disabled={isSubmittingComment}
                      className="block w-full rounded-lg border border-card-border bg-[#fdf6ed]/40 px-3 py-2 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#778873] focus:outline-none disabled:opacity-50"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Type your comment..."
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      disabled={isSubmittingComment}
                      className="block w-full rounded-lg border border-card-border bg-[#fdf6ed]/40 px-3 py-2 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#778873] focus:outline-none disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="inline-flex items-center justify-center rounded-lg bg-[#778873] px-4 py-2 text-xs font-semibold text-white hover:bg-[#a1bc98] transition-colors disabled:opacity-50 active:scale-95 shadow-sm"
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Issue Metadata & AI Analysis */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="rounded-[20px] border border-card-border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-700 border-b border-neutral-100 pb-3">
              Issue Properties
            </h2>

            {/* Status dropdown */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-neutral-500 font-semibold">Status</span>
              <select
                value={issue.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                disabled={updatingField !== null}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold focus:outline-none select-none transition-all cursor-pointer ${getStatusBadgeClass(issue.status)}`}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority dropdown */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-neutral-500 font-semibold">Priority</span>
              <select
                value={issue.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
                disabled={updatingField !== null}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold focus:outline-none select-none transition-all cursor-pointer ${getPriorityBadgeClass(issue.priority)}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Timestamps */}
            <div className="border-t border-neutral-100 pt-4 space-y-2 text-[11px] text-neutral-500">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-400">Created:</span>
                <span className="text-neutral-600">{formatDate(issue.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-400">Updated:</span>
                <span className="text-neutral-600">{formatDate(issue.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* AI Analysis Panel - Sage Green Tint Gradient */}
          <div className="relative overflow-hidden rounded-[20px] border border-[#a1bc98]/40 bg-gradient-to-b from-[#a1bc98]/10 via-white to-white p-6 shadow-sm">
            {/* Soft Sage glow background blob */}
            <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#778873]/15 blur-xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#a1bc98]/20 pb-4 mb-4">
              <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-1.5">
                <svg
                  className="h-4.5 w-4.5 text-[#778873] animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI Gemini Analysis
              </h2>
              {issue.latestAnalysis && (
                <span className="text-[10px] text-neutral-400 font-semibold">
                  {new Date(issue.latestAnalysis.generatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {aiError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 mb-4 text-xs text-rose-700">
                {aiError}
              </div>
            )}

            {/* Analysis details */}
            {isAnalyzing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-2 border-[#a1bc98]/35 border-t-[#778873] animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#778873] animate-pulse">
                    Synthesizing with Gemini...
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Analyzing description & comment thread
                  </p>
                </div>
              </div>
            ) : currentAnalysis ? (
              <div className="space-y-5">
                {/* Summary */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#778873]">
                    Summary
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap">
                    {currentAnalysis.summary}
                  </p>
                </div>

                {/* Themes and Sentiment */}
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#778873]">
                      Sentiment
                    </span>
                    <div>
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${getSentimentPillClass(currentAnalysis.sentiment)}`}>
                        {currentAnalysis.sentiment}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#778873]">
                      Key Themes
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {currentAnalysis.keyThemes?.map((theme, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded bg-[#fdf6ed] border border-card-border px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 uppercase tracking-wider text-[#778873]"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-2 border-t border-neutral-100 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#778873]">
                    Suggested Next Steps
                  </span>
                  <ul className="space-y-2">
                    {currentAnalysis.nextSteps?.map((step, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-neutral-600">
                        <svg
                          className="h-4 w-4 text-[#778873] shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="leading-tight">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                 {/* Recalculate button */}
                <div className="border-t border-neutral-100 pt-4 mt-6">
                  <button
                    onClick={handleTriggerAnalysis}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#778873] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#a1bc98] transition-colors active:scale-95 shadow-sm"
                  >
                    Refresh AI Analysis
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <p className="text-xs text-neutral-450">
                  No analysis has been generated for this issue yet.
                </p>
                <button
                  onClick={handleTriggerAnalysis}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#778873] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#a1bc98] transition-colors active:scale-95 shadow-sm"
                >
                  Analyze with Gemini
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
