import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { addButtonClass, inputClass } from './formStyles';

export default function TodoListInput({ items, onChange }) {
  const [text, setText] = useState('');

  const add = () => {
    const value = text.trim();
    if (!value) return;
    onChange([...items, value]);
    setText('');
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div>
      {items.length > 0 && (
        <ul className="mb-2 space-y-2">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
              <span className="text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 text-sm text-slate-800">{item}</span>
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
        <input
          type="text"
          value={text}
          placeholder="Enter task"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // don't submit the whole form
              add();
            }
          }}
          className={`${inputClass()} h-11`}
        />
        <button type="button" onClick={add} className={addButtonClass}>
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}
