import type { ComponentProps } from 'react';

export default function StarButton({
  className = '',
  ...props
}: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={`
        group inline-flex items-center justify-center
        h-9 w-9 rounded-full
        bg-white/10 border border-white/20
        hover:bg-white/20 active:bg-white/25
        focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70
        transition
        ${className}
      `}
      aria-label={props['aria-label'] ?? 'Star button'}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-yellow-300 drop-shadow
                   transition-transform duration-200
                   group-hover:rotate-[18deg] group-active:scale-95"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="kirbyStar" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffd166"/>
            <stop offset="100%" stopColor="#ffe8a3"/>
          </linearGradient>
        </defs>
        <path
          fill="url(#kirbyStar)"
          d="M12 2l2.35 5.2 5.65 1-4.2 3.9.98 5.7L12 15.9 7.22 17.8l.98-5.7-4.2-3.9 5.65-1L12 2z"
        />
      </svg>
    </button>
  );
}