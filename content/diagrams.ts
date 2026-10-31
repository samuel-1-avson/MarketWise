import type { TopicId } from "@/lib/schemas";

export type FlowNode = {
  label: string;
  /** One or two short lines under the label (SVG text does not wrap, so keep them short). */
  lines: readonly string[];
};

export type FlowDiagram = {
  title: string;
  /** What the picture shows, for screen readers and for anyone not seeing the graphic. */
  summary: string;
  nodes: readonly FlowNode[];
  /** Label on the arrow leaving node i (the last node has none). */
  links: readonly string[];
  /** True when the diagram quotes fictional numbers, so the illustrative label is shown. */
  usesIllustrativeNumbers: boolean;
};

/**
 * One mechanism per lesson: the words for the bespoke picture and its text version.
 * The picture itself is drawn in components/diagrams/TopicIllustration.tsx.
 */
export const diagrams: Record<TopicId, FlowDiagram> = {
  forex: {
    title: "Reading an invented USD/GHS quote",
    summary:
      "Two plates show an invented USD/GHS quote: one US dollar written as 10.00 Ghana cedis. The arrow points one way. That writing is for this pair only, not a property of either currency.",
    nodes: [
      { label: "US dollar", lines: ["One dollar, written as", "the first side of USD/GHS"] },
      { label: "Ghana cedis", lines: ["10.00 cedis, invented,", "the other side of the pair"] },
      { label: "One arrow", lines: ["The quote runs one way", "It is not a rate both ways"] },
      { label: "This pair only", lines: ["Not a property of the", "dollar or the cedi alone"] },
    ],
    links: ["quoted as", "in one direction", "so the number means"],
    usesIllustrativeNumbers: true,
  },
  stocks: {
    title: "A company drawn as shares",
    summary:
      "A company mark sits beside a grid that stands for 1,000 equal shares. The squares are not a count of those shares. Ten shares would be 1%, and that fraction is not a promised payment. The steps below add how shares can be sold and how a dividend can work; they are not all in the drawing.",
    nodes: [
      { label: "Company (issuer)", lines: ["Splits ownership into", "1,000 equal shares"] },
      { label: "Shares sold", lines: ["Company raises money", "from the first buyers"] },
      { label: "Exchange", lines: ["Buyers and sellers trade", "shares with each other"] },
      {
        label: "Shareholder",
        lines: ["Owns a fraction, e.g. 10", "of 1,000 shares = 1%", "Not a promised payment"],
      },
    ],
    links: ["offers shares", "listed for trading", "may receive a dividend"],
    usesIllustrativeNumbers: true,
  },
  commodities: {
    title: "A supply chain and two kinds of price",
    summary:
      "Farm, processor and factory are the physical chain. The dashed box is a futures contract: a separate obligation that is often closed out or settled in cash, not these goods moving later.",
    nodes: [
      { label: "Farm", lines: ["Grows and harvests", "the cocoa beans"] },
      { label: "Buyer / processor", lines: ["Pays the spot price", "for delivery now"] },
      { label: "Manufacturer", lines: ["Turns beans into", "finished products"] },
      {
        label: "Futures contract",
        lines: ["Separate obligation;", "often closed out or cash-settled"],
      },
    ],
    links: ["sells at spot", "ships and processes", "shifts price risk; other risk remains"],
    usesIllustrativeNumbers: false,
  },
  crypto: {
    title: "How a ledger entry is added",
    summary:
      "Five computers around a record they must agree on. Each keeps its own copy; the box in the middle is not a central book. A blockchain is one design among others. The steps below are a request, a broadcast, a check, then the copies agreeing.",
    nodes: [
      { label: "Request", lines: ["A user authorises a", "transfer using a secret key"] },
      { label: "Broadcast", lines: ["The request is sent to", "many computers on the network"] },
      { label: "Validation", lines: ["Participants check the", "rules before accepting it"] },
      { label: "Ledger updated", lines: ["The entry is added and", "all copies agree"] },
    ],
    links: ["sent to network", "checked", "agreed and recorded"],
    usesIllustrativeNumbers: false,
  },
  "sports-betting": {
    title: "A wager is an agreement, not an asset",
    summary:
      "An event has defined possible outcomes. Two branches are drawn; an event can have more. Terms are agreed before it happens. When it ends, the operator settles under its written rules, and nothing is owned afterwards.",
    nodes: [
      { label: "Event", lines: ["A match with defined", "possible outcomes"] },
      { label: "Agreement", lines: ["Terms set by an operator;", "no ownership is created"] },
      { label: "Result", lines: ["The real-world outcome", "is decided by the event"] },
      { label: "Settlement", lines: ["Operator settles by its rules;", "the agreement ends"] },
    ],
    links: ["terms published", "event takes place", "outcome applied"],
    usesIllustrativeNumbers: false,
  },
};
