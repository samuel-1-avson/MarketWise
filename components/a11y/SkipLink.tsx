export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-none border border-[var(--border-subtle)] bg-[var(--btn-primary)] px-4 py-2 font-semibold text-[var(--btn-primary-text)]"
    >
      Skip to main content
    </a>
  );
}
