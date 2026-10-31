import type { TopicId } from "@/lib/schemas";

/**
 * One distinct line glyph per topic, so identity never depends on colour alone. Decorative:
 * the adjacent heading names the topic.
 */
export function TopicGlyph({ topic, size = 40 }: { topic: TopicId; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  switch (topic) {
    case "forex":
      return (
        <svg {...common}>
          <path d="M6 14h25m0 0-6-6m6 6-6 6" />
          <path d="M34 27H9m0 0 6-6m-6 6 6 6" />
        </svg>
      );
    case "stocks":
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="14" />
          <path d="M20 20V6" />
          <path d="M20 20l11 8" />
          <path d="M20 20 9 28" opacity="0.5" />
        </svg>
      );
    case "commodities":
      return (
        <svg {...common}>
          <rect x="5" y="22" width="14" height="12" rx="0" />
          <rect x="21" y="22" width="14" height="12" rx="0" />
          <rect x="13" y="8" width="14" height="12" rx="0" />
        </svg>
      );
    case "crypto":
      return (
        <svg {...common}>
          <circle cx="20" cy="9" r="4" />
          <circle cx="8" cy="30" r="4" />
          <circle cx="32" cy="30" r="4" />
          <path d="M17.5 12.3 10.5 26.7M22.5 12.3l7 14.4M12 30h16" />
        </svg>
      );
    case "sports-betting":
      return (
        <svg {...common}>
          <circle cx="20" cy="7" r="3" />
          <path d="M20 10v8M20 18 9 26m11-8 11 8" />
          <rect x="5" y="27" width="8" height="8" rx="0" />
          <rect x="27" y="27" width="8" height="8" rx="0" />
        </svg>
      );
  }
}
