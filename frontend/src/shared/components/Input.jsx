export default function Input({ label, error, id, className = '', ...props }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-500">
        {label}
      </label>
      <input
        id={id}
        className={`w-full border-b bg-transparent py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--brand)] ${
          error ? 'border-red-400' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
