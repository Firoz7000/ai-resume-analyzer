import { Container } from './Container'
import { ResumeUpload } from './ResumeUpload'

export function Hero() {
  return (
    <section
      id="upload"
      className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-20 dark:border-slate-800/60 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 sm:pt-16 sm:pb-24"
    >
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-500/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-40 right-0 h-64 w-64 rounded-full bg-violet-400/10 blur-2xl dark:bg-violet-500/10"
        aria-hidden
      />

      <Container className="relative text-center">
        <p className="mb-4 inline-flex items-center rounded-full border border-indigo-200/60 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/50 dark:text-indigo-300">
          Powered by AI · PDF upload supported
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight dark:text-white">
          Analyze your resume with AI
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Get instant feedback, resume score, and job recommendations
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:items-start sm:gap-8">
          <ResumeUpload />
          <p className="max-w-[220px] text-center text-sm leading-relaxed text-slate-500 sm:pt-2 sm:text-left dark:text-slate-500">
            PDF only · Max 5 MB · Private processing
          </p>
        </div>
      </Container>
    </section>
  )
}
