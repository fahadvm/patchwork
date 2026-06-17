import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 py-4">
      {/* Back button */}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Developer Profile Card (5 cols) */}
        <div className="lg:col-span-5 rounded-[20px] border border-card-border bg-white p-8 shadow-sm space-y-6">
          <div className="text-center space-y-4 pb-6 border-b border-neutral-100">
            {/* Avatar badge */}
            <div className="mx-auto h-24 w-24 rounded-full overflow-hidden border-2 border-[#778873]/30 shadow-md">
              <Image
                src="/fahad.jpg"
                alt="Fahad VM"
                width={96}
                height={96}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#2b332a]">
                Fahad VM
              </h2>
              <span className="text-xs font-bold uppercase tracking-widest text-[#778873] block mt-1">
                Full Stack Developer
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm text-neutral-600">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Contact Information
            </h3>
            <div className="flex items-center gap-3">
              <svg className="h-4 w-4 text-[#778873] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:9745875259" className="hover:text-[#778873] transition-colors">
                9745875259
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-4 w-4 text-[#778873] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:fahadfad444@gmail.com" className="hover:text-[#778873] transition-colors break-all">
                fahadfad444@gmail.com
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Professional Links
            </h3>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <a
                href="https://github.com/fahadvm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-card-border bg-[#fdf6ed]/30 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:border-[#778873] hover:bg-[#778873]/5 transition-all"
              >
                <span className="font-serif text-sm font-bold text-[#778873]">Git</span>
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://www.fahadvm.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-card-border bg-[#fdf6ed]/30 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:border-[#778873] hover:bg-[#778873]/5 transition-all"
              >
                <span className="font-serif text-sm font-bold text-[#778873]">Port</span>
                <span>Personal Portfolio</span>
              </a>
              <a
                href="https://www.linkedin.com/in/fahad-vm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-card-border bg-[#fdf6ed]/30 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:border-[#778873] hover:bg-[#778873]/5 transition-all"
              >
                <span className="font-serif text-sm font-bold text-[#778873]">In</span>
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>

          {/* Bio Description */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Profile Bio
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              I am a Full Stack Developer with experience in React.js, Next.js, Node.js, Express.js, and MongoDB. I enjoy building scalable and user-friendly web applications while continuously learning new technologies. I am passionate about problem-solving, teamwork, and delivering quality solutions. I would love the opportunity to contribute my skills and grow with your company.
            </p>
          </div>
        </div>

        {/* Right Column: Platform Overview & System Design (7 cols) */}
        <div className="lg:col-span-7 rounded-[20px] border border-card-border bg-white p-8 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#778873] mb-2 block">
              Platform Overview
            </span>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-[#2b332a] leading-tight">
              Patchwork System
            </h1>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Patchwork is a complete, minimal, and premium issue management platform designed to organize development tasks and run automated Gemini AI sentiment analysis on user reports.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 mt-4 pt-2">
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-[#2b332a]">
                Issue Tracking
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Log development bug tickets, prioritize with low/medium/high flags, and coordinate workloads by transitioning statuses between Open, In Progress, and Closed states.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-[#2b332a]">
                Gemini AI Summary
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Harness Google Gemini 1.5 Flash models to review descriptions and comments, producing actionable summaries, sentiment analyses, key themes, and next steps.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-[#2b332a]">
                Discussion Thread
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Connect and converse through threaded commentaries. The comments are fed dynamically into the AI model context, providing highly contextualized analyses.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-[#2b332a]">
                Relational DB Schema
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Backed by a PostgreSQL relational engine utilizing Drizzle ORM mappings. Features cascading comments delete structures, seed configurations, and transaction logs.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-4">
            <span className="text-xs text-neutral-400">
              Technical Stack: NestJS, Next.js, PostgreSQL, Drizzle ORM
            </span>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-[#778873] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#a1bc98] transition-colors active:scale-95"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
