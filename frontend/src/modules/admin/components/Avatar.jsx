// Round avatar. Falls back to the first letter of the name when there is no image.
const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const COLORS = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500'];

// Same name -> same colour
const colorFor = (name = '') =>
  COLORS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % COLORS.length];

export default function Avatar({ name = '', src = '', size = 'md', className = '' }) {
  if (src) {
    return <img src={src} alt={name} className={`${SIZES[size]} rounded-full object-cover ${className}`} />;
  }

  return (
    <span
      title={name}
      className={`${SIZES[size]} ${colorFor(name)} flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
