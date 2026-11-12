// Pure SVG donut chart — no chart library needed.
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TaskDistributionChart({ pending, inProgress, completed }) {
  const segments = [
    { label: 'Pending', value: pending, color: '#8b5cf6' },
    { label: 'In Progress', value: inProgress, color: '#06b6d4' },
    { label: 'Completed', value: completed, color: '#84cc16' },
  ];
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offset = 0;
  const arcs = segments.map((s) => {
    const length = (s.value / total) * CIRCUMFERENCE;
    const arc = { ...s, length, offset };
    offset += length;
    return arc;
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="h-56 w-56 -rotate-90" role="img" aria-label="Task distribution">
        {arcs.map((a) => (
          <circle
            key={a.label}
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke={a.color}
            strokeWidth="16"
            strokeDasharray={`${a.length} ${CIRCUMFERENCE - a.length}`}
            strokeDashoffset={-a.offset}
          />
        ))}
      </svg>

      <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
