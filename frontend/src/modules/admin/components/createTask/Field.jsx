// Label + content + error text wrapper
export default function Field({ label, htmlFor, error, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
