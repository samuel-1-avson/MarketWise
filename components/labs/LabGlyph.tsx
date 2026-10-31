import { TopicGlyph } from "@/components/design/TopicGlyph";
import type { Lab } from "@/lib/schemas";
import { topicTone, type TopicTone } from "@/lib/tokens";

const NEUTRAL_TONE: TopicTone = {
  color: "#f4f7fc",
  text: "text-ink",
  border: "border-edge",
  bg: "bg-raised",
};

/** Colour classes for a lab card: its topic's identity, or neutral when it must not look tied to one system. */
export function labTone(lab: Lab): TopicTone {
  if (lab.accent === "neutral") return NEUTRAL_TONE;
  return topicTone[lab.accent ?? lab.topics[0] ?? "forex"];
}

/** Decorative glyph for a lab: its topic's glyph, or abstract tiles for a neutral lab. */
export function LabGlyph({ lab, size = 40 }: { lab: Lab; size?: number }) {
  if (lab.accent === "neutral") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="5" y="5" width="12" height="12" rx="0" />
        <rect x="23" y="5" width="12" height="12" rx="0" />
        <rect x="5" y="23" width="12" height="12" rx="0" />
        <rect x="23" y="23" width="12" height="12" rx="0" />
      </svg>
    );
  }
  return <TopicGlyph topic={lab.accent ?? lab.topics[0] ?? "forex"} size={size} />;
}
