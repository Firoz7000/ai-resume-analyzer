export function FeatureCard({ icon, title, description }) {
  return (
    <article className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-indigo-200/80 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-500/30">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-indigo-500/20 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </article>
  )
}
