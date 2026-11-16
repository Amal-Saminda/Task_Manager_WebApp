// Shared Tailwind classes for the Create Task form fields
export const inputClass = (hasError = false) =>
  `w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
  }`;

export const addButtonClass =
  'flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100';
