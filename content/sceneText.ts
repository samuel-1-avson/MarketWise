import { generateTiles, tileStats } from "@/lib/labs/uncertainty";

/**
 * What each presenter scene shows, in words. This is the single source for the picture's accessible
 * name, the on-screen "text version", and the handout. Speaker notes stay out of it.
 */
const SCENE_TEXT: Record<string, string> = {
  "orbit-question":
    "A question mark at the centre with five systems in orbit around it: forex, stocks, commodities, crypto and sports betting.",
  "five-disciplines":
    "Five columns, one per system, each stating what changes hands: forex, a currency or a contract on a rate; stocks, a slice of a company; commodities, real goods or contracts about them; crypto, entries on a shared ledger; sports betting, an agreement with no ownership.",
  "market-actors":
    "Buyers on the left and sellers on the right meet at a price in the middle. Bids flow from the buyers and asks from the sellers. A transaction runs between them, and the price sends information back to both.",
  "currency-plates":
    "A US dollar plate on the left, a Ghana cedi plate on the right, and between them an invented quote: one US dollar is worth 10.00 Ghana cedis. Illustrative only, not live data.",
  "importer-bank-exporter":
    "A fictional Accra importer owes a supplier 10,000 US dollars. A bank quotes a rate and exchanges cedis for dollars. At 10.00 the invoice costs 100,000 cedis; at 10.50 the same invoice costs 105,000 cedis, 5,000 more. Illustrative only.",
  "rate-drivers":
    "Five forces — interest rates, inflation expectations, trade flows, growth and confidence, and news and sentiment — all push on one exchange rate. No single factor sets tomorrow's price.",
  "leverage-bars":
    "Bars compare how the same fixed, invented price moves are felt in your own money. With no leverage a 1% move is a 1% change and a 5% move a 5% change; at the toy 'more' level a 1% move is a 20% change and a 5% move uses up all the money put in. Works both ways. Illustrative only.",
  "company-shares":
    "A fictional bakery split into 1,000 equal shares drawn as a grid of squares. Twenty-five are highlighted: 25 of 1,000 shares is 2.5% of the company. Illustrative only.",
  "price-drivers-mosaic":
    "A mosaic of six things that move a share price: earnings against expectations, company news, interest rates and the economy, competition, market mood, and events outside the company's control. The price is where many opinions meet.",
  "supply-chain":
    "A physical supply chain in four links: farm or mine, processor, shipping and storage, manufacturer. Cocoa, gold and oil are examples of goods. A disruption at any link changes availability further along.",
  "spot-vs-futures":
    "Two timelines. Top, spot: goods and money change hands today. Bottom, futures contract: price and date are agreed today and the exchange, or a cash settlement, happens later. Many contracts are closed out before delivery.",
  "supply-curve":
    "A stylised supply and demand chart with no numbers. In a fictional drought the supply line moves left, so where supply meets demand moves to a higher price and a lower quantity. A teaching diagram, not a forecast.",
  "ledger-network":
    "Seven computers around a shared ledger, each keeping its own copy. A request is checked against the rules before it is added as a new entry, and all copies agree.",
  "crypto-risks":
    "Three crypto risk cards: volatility, custody, and protocols and platforms. Price is only one kind of risk.",
  "outcome-branch":
    "A wager as an agreement: an event with defined possible outcomes, an agreement on terms set by an operator, one outcome happening, settlement under the operator's rules, and then the agreement ends with nothing owned. There are no figures and no betting tools.",
  "four-objects":
    "Four different objects and what you hold afterwards: a share, a continuing ownership interest; a currency exchange, money delivered, though retail margin forex is generally a contract with a dealer; a futures contract, an agreement about a later date and price; a wager, an agreement that ends at settlement.",
  "speculation-spectrum":
    "A spectrum from using a system because you need it, to purely speculating. Forex, stocks, commodities and crypto are drawn across wide ranges. Sports betting, with no ownership or asset use, sits only at the speculative end. A real purpose never means risk-free. This is the site's own simplified framing, not a source finding, and the positions are illustrative.",
  "redacted-claims":
    "Three typical hype claims, shown struck through: never lose again, secret system act now, guaranteed returns. Below them, five questions to ask of any claim: what is the object, who benefits, where is the evidence, what is guaranteed, and what if it is wrong?",
  "friction-cards":
    "Four costs that apply whichever way the price moves: spreads and commissions, financing and margin costs, storage and transport, and custody and network costs. A cost is certain; a gain is not.",
  "risk-columns":
    "Five stacked risk columns, one per system. Forex: leverage, costs add up, hard to predict. Stocks: price can fall, all the money put in can be lost, paid last if the company fails. Commodities: supply shocks, futures obligations, can lose more than put in. Crypto: volatility, custody mistakes, scams and weak protections. Sports betting: financial loss, can harm health and relationships, can reach families.",
  "audience-questions":
    "Three audience questions with options A, B and C. One: which gives you a fractional ownership interest in a business? Two: does leverage create free money? Three: a fair coin lands heads five times, so the next flip is equally likely either way, more likely tails, or certain heads? Answers are discussed aloud, with no prizes.",
  "five-takeaways":
    "Five takeaways: mechanism first; risks always; costs count; claims need evidence; uncertainty never disappears.",
  "keep-learning":
    "Where to keep learning: explore the lessons at /explore, practise with the labs and quiz at /labs and /quiz, and check the sources at /resources. For learning only: fictional numbers, no financial advice, no trading signals, no wagering instructions, no live data.",
};

/** The uncertainty scene's wording includes the streak in the same fixed set the picture draws. */
function uncertaintyFieldText(): string {
  const tiles = generateTiles(7, "even", 60);
  const stats = tileStats(tiles, 60);
  const tile = stats.longest.tile ?? "shape";
  return `Sixty circles and squares drawn at random from a fixed set. The longest run of the same shape is ${stats.longest.length} ${tile}s in a row, outlined. Streaks are normal in random draws.`;
}

/** Picture description for a slide visual. Empty only when the id is unknown. */
export function sceneDescription(visual: string): string {
  if (visual === "uncertainty-field") return uncertaintyFieldText();
  return SCENE_TEXT[visual] ?? "";
}

export const SCENE_TEXT_IDS: readonly string[] = [...Object.keys(SCENE_TEXT), "uncertainty-field"];
