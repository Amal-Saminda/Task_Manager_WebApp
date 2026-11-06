export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`w-full rounded-md bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--brand)]/30 transition hover:brightness-110 active:scale-[.98] disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
