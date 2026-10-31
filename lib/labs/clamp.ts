/**
 * Input hygiene shared by every lab. Anything a control or a URL could hand us — blank text, NaN,
 * Infinity, a string, a decimal — is turned into a safe whole number inside the allowed range, so a
 * lab can never show NaN, an empty graph or an out-of-range state.
 */
export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(n)) return Math.min(max, Math.max(min, fallback));
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** Formats with a fixed number of decimals using a stable locale (avoids server/client mismatch). */
export function fixed(value: number, decimals: number): string {
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Whole-number or one-decimal text without a trailing ".0" (e.g. 2.5, 20, 0.5). */
export function trimmed(value: number, decimals = 1): string {
  return Number(value.toFixed(decimals)).toLocaleString("en-GB", {
    maximumFractionDigits: decimals,
  });
}
