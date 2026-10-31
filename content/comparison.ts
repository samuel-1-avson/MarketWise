import type { ComparisonDimension } from "@/lib/schemas";

/**
 * Side-by-side answers to the same questions. Each cell is deliberately short and describes the
 * mechanism — there is no ranking, no "best returns" and no suggestion that any column is safer.
 */
export const comparison: readonly ComparisonDimension[] = [
  {
    id: "what-is-involved",
    label: "What is involved?",
    question: "What is the object at the centre of the activity?",
    cells: {
      forex:
        "An exchange rate between two currencies — either a real exchange of money or a contract on the rate.",
      stocks: "A share: a fractional ownership interest in a company.",
      commodities: "Physical goods such as cocoa or gold, or futures contracts tied to them.",
      crypto: "Tokens recorded on a shared digital ledger; what each token represents varies.",
      "sports-betting": "A wager on a defined sporting outcome, under an operator's rules.",
    },
  },
  {
    id: "what-you-hold",
    label: "What you hold afterwards",
    question: "What do you actually have once you take part?",
    cells: {
      forex:
        "Foreign currency after a genuine exchange; in retail margin forex, generally a contract with a dealer rather than the currency itself.",
      stocks: "A continuing ownership stake that can rise, fall or become worthless.",
      commodities:
        "Goods in hand, or a contract with a set date and price — not the same as owning the goods.",
      crypto: "Control of a ledger entry through keys, held by you or by a provider.",
      "sports-betting": "No ownership stake. An agreement that ends when the outcome is settled.",
    },
  },
  {
    id: "economic-use",
    label: "Underlying economic use",
    question: "What useful job, if any, does the system do?",
    cells: {
      forex: "Pays for trade, travel and remittances, and lets businesses manage currency risk.",
      stocks: "Lets companies raise money and lets investors share in the business.",
      commodities: "Moves goods from producers to users and lets them manage price risk.",
      crypto:
        "Varies by network: records, transfers and applications; many tokens are traded mainly as assets.",
      "sports-betting":
        "Not asset ownership or capital formation; a commercial service where participants stake money on an outcome.",
    },
  },
  {
    id: "who-takes-part",
    label: "Who takes part",
    question: "Who are the main participants?",
    cells: {
      forex: "Banks, importers and exporters, central banks, institutions and retail speculators.",
      stocks: "Companies, investors, brokers, exchanges and regulators.",
      commodities:
        "Farmers and miners, processors, manufacturers, hedgers, speculators and exchanges.",
      crypto: "Users, network participants, exchanges and custodians, developers, and speculators.",
      "sports-betting":
        "Participants making wagers, operators, regulators where they exist, and the families affected.",
    },
  },
  {
    id: "price-source",
    label: "Where price or outcome comes from",
    question: "What decides the price or the result?",
    cells: {
      forex:
        "Supply and demand for each currency, shaped by interest rates, trade and economic conditions.",
      stocks: "Buyers and sellers' changing assessments of a company's prospects.",
      commodities: "Supply and demand: weather, inventories, transport, demand and expectations.",
      crypto: "Buyers and sellers on trading venues; network rules decide which entries are valid.",
      "sports-betting":
        "The real-world result of an event; the operator's terms are set separately by the operator.",
    },
  },
  {
    id: "core-uncertainty",
    label: "Core uncertainty",
    question: "What is hardest to know in advance?",
    cells: {
      forex: "How an exchange rate will change.",
      stocks: "What a company, and the market's view of it, will be worth.",
      commodities: "Supply, demand and contract terms.",
      crypto: "Adoption, technology, price and the safety of custody.",
      "sports-betting": "The outcome of the event, and the operator's terms.",
    },
  },
  {
    id: "frictions",
    label: "Common frictions",
    question: "What costs get in the way regardless of direction?",
    cells: {
      forex: "Spreads, commissions and financing costs.",
      stocks: "Broker fees, spreads and taxes.",
      commodities: "Storage, transport and fees.",
      crypto: "Network and venue fees, and custody costs.",
      "sports-betting": "The operator's built-in margin and its rules.",
    },
  },
  {
    id: "caveat",
    label: "Important caveat",
    question: "What is the one thing most worth remembering?",
    cells: {
      forex: "Leverage magnifies losses, and with some products they can exceed the deposit.",
      stocks: "Ownership does not guarantee gains, dividends or control.",
      commodities:
        "Futures are not the same as owning the goods, and losses can exceed the amount put in.",
      crypto:
        "Protections that apply to some regulated products may not apply, and vary by place; a lost key or failed provider can mean permanent loss.",
      "sports-betting":
        "Gambling carries its own documented harms, which can reach families; speculative trading can also cause serious losses.",
    },
  },
];
