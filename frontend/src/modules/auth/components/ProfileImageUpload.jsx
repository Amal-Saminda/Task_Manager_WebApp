import { useEffect, useRef, useState } from 'react';
import { Camera, UserRound } from 'lucide-react';
import { ALLOWED_IMAGE_TYPES } from '../utils/validators';

export default function ProfileImageUpload({ file, onChange, error }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState('');

  // Create / clean up the preview URL
  useEffect(() => {
    if (!file) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload profile picture"
        className={`group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-slate-50 transition focus:outline-none focus:ring-4 ${
          error
            ? 'border-red-400 focus:ring-red-100'
            : 'border-slate-300 hover:border-blue-500 focus:ring-blue-100'
        }`}
      >
        {preview ? (
          <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-10 w-10 text-slate-300" />
        )}

        <span className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 transition group-hover:opacity-100">
          <Camera className="h-5 w-5 text-white" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />

      <p className="mt-2 text-sm font-medium text-slate-800">
        {file ? 'Change photo' : 'Upload profile photo'}
        <span className="ml-0.5 text-red-500">*</span>
      </p>
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : (
        <p className="mt-1 text-xs text-slate-500">JPG, PNG or WebP, max 2MB</p>
      )}
    </div>
  );
}
