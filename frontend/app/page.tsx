import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-full space-y-24 py-8">
      {/* Hero Section */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 py-8 overflow-hidden min-h-[460px]">
        {/* Left Column (55% width) */}
        <div className="flex-1 space-y-6 max-w-2xl z-10 text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#778873] block">
              UI/UX Issue Tracker & AI Analyst
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2b332a] leading-tight">
              Hello, organize your work with Patchwork
            </h1>
          </div>
          <p className="text-base text-neutral-600 leading-relaxed max-w-lg">
            Browse, filter, and run AI-powered Gemini analyses on open tickets. 
            Discuss bugs, collaborate with comments, and streamline your software development workflow.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/issues/new"
              className="inline-flex items-center justify-center rounded-lg bg-[#778873] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#a1bc98] hover:shadow-lg transition-all duration-200 active:scale-95 animate-fade-in"
            >
              + New Issue
            </Link>
            <a
              href="http://localhost:3001/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border-2 border-[#778873] px-6 py-3 text-sm font-semibold text-[#778873] hover:bg-[#778873] hover:text-white transition-all duration-200 active:scale-95"
            >
              API Swagger Docs
            </a>
          </div>
        </div>

        {/* Right Column (Organic shape + illustration) */}
        <div className="relative flex-1 w-full max-w-[420px] lg:max-w-none flex items-center justify-center min-h-[340px] lg:min-h-[420px]">
          {/* Sage Green Organic Blob matching the color scheme */}
          <div 
            className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] bg-[#778873]/95 opacity-90 transition-all duration-500 select-none pointer-events-none" 
            style={{ 
              borderRadius: '43% 57% 53% 47% / 37% 45% 55% 63%',
              animation: 'spin 40s linear infinite'
            }}
          />
          {/* Circular portrait-style image */}
          <div className="relative z-10 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] rounded-full overflow-hidden border-8 border-white shadow-xl bg-white flex items-center justify-center">
            <Image
              src="/hero_illustration.png"
              alt="Team work illustration"
              width={320}
              height={320}
              className="w-full h-full object-cover select-none"
              priority
            />
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b332a]">
            Designed for simplicity
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Everything you need to track code tasks and analyze sentiment, built inside a premium aesthetic dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-card-border bg-white p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-[#778873]/10 flex items-center justify-center text-[#778873]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2b332a]">Gemini Intelligence</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Synthesize client issue reports and conversation histories instantly. Get key themes, action points, and tone feedback powered by Google Gemini 1.5.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-card-border bg-white p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-[#778873]/10 flex items-center justify-center text-[#778873]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2b332a]">Collaborative Threads</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Post real-time status updates and comments. Threads build context dynamically so developers and AI agents stay in complete alignment.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-card-border bg-white p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-[#778873]/10 flex items-center justify-center text-[#778873]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-2.19 8-4V7M4 7c0 2.21 3.582 4 8 4s8-2.19 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-2.19-8-4" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2b332a]">Robust Tech Stack</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Engineered with Next.js, NestJS, and PostgreSQL. Supported by type-safe migrations through Drizzle ORM to ensure performance and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="rounded-3xl border border-card-border bg-white p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Background blobs for premium depth */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 h-64 w-64 rounded-full bg-[#778873]/5 blur-3xl pointer-events-none" />
        
        <div className="space-y-3 max-w-xl text-center md:text-left z-10">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b332a]">
            Want to see the system in action?
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Read about the platform design philosophy, system architecture, database configurations, and developer details.
          </p>
        </div>
        
        <div className="shrink-0 z-10">
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-xl bg-[#778873] px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#a1bc98] hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            Learn About Patchwork
          </Link>
        </div>
      </section>
    </div>
  );
}

