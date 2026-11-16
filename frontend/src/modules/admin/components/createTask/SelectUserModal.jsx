import { useState } from 'react';
import { Check } from 'lucide-react';
import Avatar from '../Avatar';

// Mounted only while open, so `draft` always starts from the saved selection.
export default function SelectUserModal({ members, selectedIds, onSave, onClose }) {
  const [draft, setDraft] = useState(selectedIds);

  const toggle = (id) =>
    setDraft((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <Modal title="Select Users" onClose={onClose}>
      <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
        {members.map((m) => {
          const checked = draft.includes(m.id);
          return (
            <li key={m.id}>
              <label className="flex cursor-pointer items-center gap-3 py-3">
                <Avatar name={m.name} src={m.avatar} size="lg" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{m.name}</span>
                  <span className="block truncate text-xs text-slate-500">{m.email}</span>
                </span>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(m.id)}
                  className="peer sr-only"
                />
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border transition peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100 ${
                    checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {checked && <Check className="h-3.5 w-3.5" />}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
