import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import FormInput from './FormInput';

export default function PasswordInput({ label = 'Password', name = 'password', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <FormInput
      label={label}
      name={name}
      icon={Lock}
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="rounded-md p-1 text-slate-400 transition hover:text-slate-700"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
      {...props}
    />
  );
}
