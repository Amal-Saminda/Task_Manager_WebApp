import { useRef, useState } from 'react'

const MAX_MB = 2

export default function AvatarUpload({ onChange }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Please choose an image file')
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Image must be under ${MAX_MB}MB`)
    setError('')
    setPreview(URL.createObjectURL(file))
    onChange?.(file)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
        aria-label="Upload profile picture"
      >
        {preview ? (
          <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V5m0 0-4 4m4-4 4 4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
          </svg>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      <span className="text-xs text-slate-500">{preview ? 'Change photo' : 'Upload profile picture'}</span>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
