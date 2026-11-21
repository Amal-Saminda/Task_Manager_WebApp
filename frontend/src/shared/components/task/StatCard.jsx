const ACCENTS = {
  blue: 'bg-blue-600',
  violet: 'bg-violet-500',
  cyan: 'bg-cyan-500',
  green: 'bg-lime-500',
  red: 'bg-rose-500',
};

export default function StatCard({ label, value, accent = 'blue' }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-5 w-1.5 rounded-full ${ACCENTS[accent]}`} />
      <p className="text-sm text-slate-500">
        <span className="mr-1.5 text-base font-semibold text-slate-900">{value}</span>
        {label}
      </p>
    </div>
  );
}
