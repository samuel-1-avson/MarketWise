import { palette } from "@/lib/tokens";

const DOTS = [palette.forex, palette.stocks, palette.commodities, palette.crypto, palette.sports];

/** Share-card layout. Satori needs flex and plain colours, so this does not use Tailwind. */
export function ogCard({
  kicker,
  title,
  detail,
  accent = palette.forex,
}: {
  kicker: string;
  title: string;
  detail: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: palette.midnight,
        color: palette.ink,
        padding: "64px 72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {DOTS.map((color) => (
          <div
            key={color}
            style={{ width: 22, height: 22, borderRadius: 11, background: color, display: "flex" }}
          />
        ))}
        <div
          style={{ display: "flex", marginLeft: 12, color: accent, fontSize: 28, letterSpacing: 4 }}
        >
          {kicker}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? 40 : title.length > 32 ? 52 : 68,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: palette.muted, lineHeight: 1.35 }}>
          {detail}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: palette.commodities }}>
        Education only. Fictional examples. Not financial advice or live data.
      </div>
    </div>
  );
}
