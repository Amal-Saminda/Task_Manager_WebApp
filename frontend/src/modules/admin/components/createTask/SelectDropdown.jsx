import { ChevronDown } from 'lucide-react';
import { inputClass } from './formStyles';

// Simple styled <select>. options: [{ label, value }]
export default function SelectDropdown({ id, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass()} h-11 cursor-pointer appearance-none pr-10`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
