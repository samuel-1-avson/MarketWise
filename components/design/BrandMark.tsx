/** Decorative observatory mark: a core with five squared geometric topic nodes in orbit. */
export function BrandMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
        focusable="false"
        className="overflow-visible"
      >
        <rect
          x="10"
          y="10"
          width="44"
          height="44"
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          transform="rotate(45 32 32)"
        />
        <rect
          x="26"
          y="26"
          width="12"
          height="12"
          fill="var(--btn-primary)"
        />
        <rect
          x="10"
          y="38"
          width="6"
          height="6"
          fill="var(--border-subtle)"
        />
        <rect
          x="48"
          y="22"
          width="6"
          height="6"
          fill="var(--border-subtle)"
        />
        <rect
          x="20"
          y="12"
          width="6"
          height="6"
          fill="var(--border-subtle)"
        />
        <rect
          x="42"
          y="48"
          width="6"
          height="6"
          fill="var(--border-subtle)"
        />
      </svg>
    </span>
  );
}
