
import { useState } from 'react';
import { Check } from 'lucide-react';
import Avatar from '../Avatar';

export default function SelectUserModal({
  members,
  selectedIds,
  onSave,
  onClose
}) {

  const [draft, setDraft] = useState(selectedIds || []);

  const toggle = (id) => {
    setDraft((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-lg">

      <h3 className="mb-3 text-lg font-semibold">
        Select Team Members
      </h3>

      <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">

        {members.map((m) => {
          const checked = draft.includes(m._id);

          return (
            <li key={m._id}>
              <label className="flex cursor-pointer items-center gap-3 py-3">

                <Avatar
                  name={m.name}
                  src={m.profileImageUrl}
                  size="lg"
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {m.name}
                  </span>

                  <span className="block truncate text-xs text-slate-500">
                    {m.email}
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(m._id)}
                  className="peer sr-only"
                />

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    checked
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
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
          className="rounded-xl px-4 py-2.5 text-sm text-slate-600"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onSave(draft)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Done
        </button>

      </div>
    </div>
  );
}
