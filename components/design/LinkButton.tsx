import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-none px-6 py-2.5 text-sm font-semibold tracking-tight transition-all duration-[var(--duration-fast)] ease-[var(--ease-observatory)] active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--btn-primary)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-hover)] shadow-none border border-[var(--btn-primary)]",
  secondary:
    "border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--btn-primary)]",
  ghost:
    "text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]",
};

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
