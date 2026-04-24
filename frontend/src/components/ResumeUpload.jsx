import { useRef, useState } from 'react'
import { apiFetch } from '../services/api'
import { PrimaryButton } from './PrimaryButton'

const MAX_BYTES = 5 * 1024 * 1024
const TARGET_ROLES = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
]

function isPdfFile(file) {
  return (
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf')
  )
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
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
  )
}

export function ResumeUpload() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState(null)

  function openPicker() {
    setError(null)
    setSuccess(false)
    setResult(null)
    inputRef.current?.click()
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0]
    setError(null)

    if (!selected) {
      return
    }

    if (!isPdfFile(selected)) {
      setError('Please choose a PDF file.')
      event.target.value = ''
      return
    }

    if (selected.size > MAX_BYTES) {
      setError('File is too large. Maximum size is 5 MB.')
      event.target.value = ''
      return
    }

    setFile(selected)
  }

  function clearFile() {
    setFile(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  async function handleUpload() {
    if (!file || loading) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    const body = new FormData()
    body.append('resume', file)
    body.append('targetRole', targetRole)

    try {
      const data = await apiFetch('/api/analyze', {
        method: 'POST',
        body,
      })
      // Expected shape: { textPreview, analysis: { score, strengths, ... } }
      setResult({
        analysis: data?.analysis || null,
        targetRole: data?.targetRole || targetRole,
      })
      setSuccess(true)
      clearFile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <label className="mb-3 block text-left">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Target Role
        </span>
        <select
          value={targetRole}
          onChange={(event) => setTargetRole(event.target.value)}
          disabled={loading}
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
          aria-label="Select target role"
        >
          {TARGET_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Choose resume PDF"
      />

      {!file ? (
        <div className="flex flex-col items-center gap-3 sm:items-stretch">
          <PrimaryButton
            type="button"
            onClick={openPicker}
            disabled={loading}
            className="min-w-[180px] sm:min-w-[200px]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload Resume
          </PrimaryButton>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-sm shadow-slate-200/50 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-none">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Selected file
          </p>
          <p className="mt-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {file.name}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Spinner />
                  Analyzing…
                </>
              ) : (
                'Upload & analyze'
              )}
            </button>
            <button
              type="button"
              onClick={clearFile}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 underline-offset-2 hover:underline disabled:opacity-50 dark:text-slate-400"
            >
              Change file
            </button>
          </div>
        </div>
      )}

      {error ? (
        <p
          className="mt-3 text-center text-sm text-red-600 dark:text-red-400 sm:text-left"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-3 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 sm:text-left">
          Resume uploaded successfully.
        </p>
      ) : null}

      {result?.analysis ? (
        <ResultsCard analysis={result.analysis} targetRole={result.targetRole} />
      ) : null}
    </div>
  )
}

function ResultsCard({ analysis, targetRole }) {
  const score = typeof analysis.score === 'number' ? analysis.score : 0
  const scoreMeta = getScoreMeta(score)

  function handleDownloadReport() {
    window.print()
  }

  return (
    <section className="animate-fade-up mt-6 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 text-left shadow-lg shadow-slate-200/60 backdrop-blur-lg dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-none">
      <div className="relative p-5">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-56 w-[28rem] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/10"
          aria-hidden
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700/80 dark:text-indigo-300/80">
                ResumeIQ
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-950/25 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Analysis Complete
              </span>
            </div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Resume Analysis
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Here’s what to improve for better applications.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ScoreRing score={score} />
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Resume Score
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {score}
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-500">
                    {' '}
                    / 100
                  </span>
                </p>
                <span
                  className={[
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                    scoreMeta.badgeClass,
                  ].join(' ')}
                >
                  {scoreMeta.label}
                </span>
              </div>
              <div className="mt-2 h-2 w-44 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-[width] duration-700"
                  style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                />
              </div>
              <p className="mt-2 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                Score is based on relevance, consistency, and role alignment.
              </p>
            </div>
          </div>
        </div>

        {analysis ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-900"
              title="Opens print dialog. Choose PDF > Save as PDF."
            >
              Export as PDF
            </button>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Opens print dialog. Choose PDF &gt; Save as PDF.
            </p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <SectionCard
            title="Strengths"
            tone="good"
            icon={<IconSpark />}
            items={analysis.strengths}
          />
          <SectionCard
            title="Weaknesses"
            tone="bad"
            icon={<IconAlert />}
            items={analysis.weaknesses}
          />
          <SectionCard
            title="Missing Skills"
            tone="neutral"
            icon={<IconPuzzle />}
            items={analysis.missing_skills}
            scroll
          />
          <SectionCard
            title="Improvement Suggestions"
            tone="tips"
            icon={<IconWand />}
            items={analysis.improvement_suggestions}
            scroll
          />
          <div className="sm:col-span-2">
            <SectionCard
              title="Recommended Job Roles"
              tone="roles"
              icon={<IconBriefcase />}
              items={analysis.recommended_job_roles}
              chips
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ScoreRing({ score }) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0))
  const r = 18
  const c = 2 * Math.PI * r
  const dash = (clamped / 100) * c

  return (
    <div className="relative grid h-14 w-14 place-items-center">
      <svg
        className="h-14 w-14 -rotate-90"
        viewBox="0 0 48 48"
        aria-label={`Resume score ${clamped} out of 100`}
      >
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="text-indigo-600"
        />
      </svg>
      <span className="absolute text-sm font-bold text-slate-900 dark:text-white">
        {clamped}
      </span>
    </div>
  )
}

function SectionCard({
  title,
  icon,
  items,
  tone = 'neutral',
  chips = false,
  scroll = false,
}) {
  const list = Array.isArray(items) ? items.filter(Boolean) : []

  const toneStyles =
    tone === 'good'
      ? {
          ring: 'ring-emerald-500/10',
          bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
          border: 'border-emerald-200/60 dark:border-emerald-500/20',
          icon: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/40',
        }
      : tone === 'bad'
        ? {
            ring: 'ring-rose-500/10',
            bg: 'bg-rose-50/60 dark:bg-rose-950/20',
            border: 'border-rose-200/60 dark:border-rose-500/20',
            icon: 'text-rose-600 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-950/40',
          }
        : tone === 'tips'
          ? {
              ring: 'ring-indigo-500/10',
              bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
              border: 'border-indigo-200/60 dark:border-indigo-500/20',
              icon: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-950/40',
            }
          : tone === 'roles'
            ? {
                ring: 'ring-violet-500/10',
                bg: 'bg-violet-50/50 dark:bg-violet-950/20',
                border: 'border-violet-200/60 dark:border-violet-500/20',
                icon: 'text-violet-600 dark:text-violet-400 bg-violet-100/80 dark:bg-violet-950/40',
              }
            : {
                ring: 'ring-slate-500/10',
                bg: 'bg-slate-50/60 dark:bg-slate-950/10',
                border: 'border-slate-200/70 dark:border-slate-700/60',
                icon: 'text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60',
              }

  return (
    <div
      className={[
        'rounded-2xl border p-4 shadow-lg backdrop-blur-lg transition duration-300 hover:scale-105 hover:shadow-xl',
        'ring-1',
        toneStyles.ring,
        toneStyles.bg,
        toneStyles.border,
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneStyles.icon}`}>
          {icon}
        </div>
        <p className="text-base font-semibold text-slate-900 dark:text-white">
          {title}
        </p>
      </div>

      {list.length ? (
        chips ? (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {list.map((item, idx) => (
              <span
                key={`${title}-${idx}`}
                className="rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-4 max-h-72 overflow-y-auto pr-2">
            <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {list.map((item, idx) => (
                <li key={`${title}-${idx}`} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400/80 dark:bg-slate-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">No data yet.</p>
      )}
    </div>
  )
}

function IconSpark() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  )
}

function IconAlert() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3h.007M10.29 3.86l-7.5 13A1.5 1.5 0 004.09 19.5h15.82a1.5 1.5 0 001.3-2.64l-7.5-13a1.5 1.5 0 00-2.6 0z" />
    </svg>
  )
}

function IconPuzzle() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.943.765-1.708 1.708-1.708h.584c.943 0 1.708.765 1.708 1.708v.584c0 .943-.765 1.708-1.708 1.708h-.584a1.708 1.708 0 01-1.708-1.708V6.087zM5.25 12.087c0-.943.765-1.708 1.708-1.708h.584c.943 0 1.708.765 1.708 1.708v.584c0 .943-.765 1.708-1.708 1.708h-.584a1.708 1.708 0 01-1.708-1.708v-.584zM14.25 18.087c0-.943.765-1.708 1.708-1.708h.584c.943 0 1.708.765 1.708 1.708v.584c0 .943-.765 1.708-1.708 1.708h-.584a1.708 1.708 0 01-1.708-1.708v-.584zM7.5 7.5h5.25v9H7.5v-2.25a1.5 1.5 0 00-1.5-1.5H3.75V9H6a1.5 1.5 0 001.5-1.5V7.5z" />
    </svg>
  )
}

function IconWand() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM16.5 7.5l4.5 4.5M12 12l4.5-4.5" />
    </svg>
  )
}

function IconBriefcase() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.75A2.25 2.25 0 0110.5 4.5h3A2.25 2.25 0 0115.75 6.75v.75m-12 3.75h18m-16.5 0v7.5A2.25 2.25 0 005.5 21h13a2.25 2.25 0 002.25-2.25v-7.5" />
    </svg>
  )
}

function getScoreMeta(score) {
  const value = Math.max(0, Math.min(100, Number(score) || 0))

  if (value >= 80) {
    return {
      label: 'Strong Profile',
      badgeClass:
        'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/25 dark:text-emerald-300',
    }
  }

  if (value >= 60) {
    return {
      label: 'Moderate Profile',
      badgeClass:
        'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-950/25 dark:text-amber-300',
    }
  }

  return {
    label: 'Needs Improvement',
    badgeClass:
      'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-950/25 dark:text-rose-300',
  }
}
