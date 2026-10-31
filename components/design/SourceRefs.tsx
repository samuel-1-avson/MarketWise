import Link from "next/link";
import { sourceById } from "@/content/sources";

/** Compact "Sources:" line linking each cited id to its entry (with review status) on /resources. */
export function SourceRefs({
  ids,
  className = "",
}: {
  ids: readonly string[];
  className?: string;
}) {
  const found = ids.map((id) => sourceById.get(id)).filter((s) => s !== undefined);
  if (found.length === 0) return null;
  return (
    <p className={`text-sm text-muted ${className}`}>
      <span className="font-semibold text-ink">Sources: </span>
      {found.map((source, i) => (
        <span key={source.id}>
          {i > 0 ? " · " : null}
          <Link
            href={`/resources#${source.id}`}
            className="underline decoration-muted underline-offset-4 hover:decoration-forex"
          >
            {source.title}
          </Link>
        </span>
      ))}
    </p>
  );
}
