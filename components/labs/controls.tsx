import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Native radio inputs styled as squared selectors: real keyboard and screen-reader behaviour, ✓ marks the choice. */
export function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold tracking-tight text-[var(--text-main)]">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="group inline-flex min-h-10 cursor-pointer items-center rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-[var(--duration-fast)] hover:border-[var(--btn-primary)] hover:text-[var(--text-main)] has-[:checked]:border-[var(--btn-primary)] has-[:checked]:bg-[var(--bg-surface-elevated)] has-[:checked]:text-[var(--text-main)] has-[:focus-visible]:outline has-[:focus-visible]:outline-[2px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--btn-primary)]"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className="hidden pr-1.5 font-bold text-[var(--btn-primary)] group-has-[:checked]:inline"
            >
              ✓
            </span>
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LabButton({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)] font-bold hover:bg-[var(--btn-hover)] disabled:opacity-40"
      : "border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] disabled:opacity-40";
  return (
    <button
      type="button"
      className={`inline-flex min-h-10 items-center justify-center rounded-none px-4 text-xs font-semibold transition-all duration-[var(--duration-fast)] ease-out active:scale-95 disabled:cursor-not-allowed ${styles} ${className}`}
      {...props}
    />
  );
}

export function RangeControl({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  valueText,
  onChange,
  children,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  valueText: string;
  onChange: (value: number) => void;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold tracking-tight text-[var(--text-main)]">
          {label}
        </label>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[var(--btn-primary)] cursor-pointer"
      />
      {children}
    </div>
  );
}
