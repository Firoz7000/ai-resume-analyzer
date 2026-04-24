export function PrimaryButton({
  children,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={
        'inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.98] ' +
        className
      }
      {...props}
    >
      {children}
    </button>
  )
}
