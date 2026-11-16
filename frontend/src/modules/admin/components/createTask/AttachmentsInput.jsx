import { useState } from 'react';
import { Paperclip, Plus, Trash2 } from 'lucide-react';
import { addButtonClass, inputClass } from './formStyles';

export default function AttachmentsInput({ items, onChange }) {
  const [link, setLink] = useState('');

  const add = () => {
    const value = link.trim();
    if (!value) return;
    onChange([...items, value]);
    setLink('');
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div>
      {items.length > 0 && (
        <ul className="mb-2 space-y-2">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
              <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-sm text-slate-800">{item}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${item}`}
                className="text-rose-400 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Paperclip className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={link}
            placeholder="Add file link"
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                add();
              }
            }}
            className={`${inputClass()} h-11 pl-10`}
          />
        </div>
        <button type="button" onClick={add} className={addButtonClass}>
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}
