import { useState } from 'react'
import Input from './Input'

export default function PasswordInput(props) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input {...props} type={show ? 'text' : 'password'} className="pr-9" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-0 top-6 p-1 text-slate-400 hover:text-slate-600"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {!show && <path d="M3 3l18 18" />}
        </svg>
      </button>
    </div>
  )
}
