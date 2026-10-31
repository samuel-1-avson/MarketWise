import type { Myth } from "@/lib/schemas";

export const myths: readonly Myth[] = [
  {
    id: "real-asset-means-safe",
    topic: "cross-system",
    claim: "Trading is automatically safe because a real asset exists behind it.",
    verdict: "False",
    correction:
      "Real economic purpose does not remove market losses, leverage, fraud, fees or behavioural risk.",
    explanation:
      "Shares can lose value and common shareholders are paid last if a company fails. Leveraged currency and futures positions can lose more than the deposit. Crypto can be volatile and its custody can fail. A market having a genuine purpose says nothing about whether speculating in it is safe.",
    sourceIds: [
      "investor-gov-stocks",
      "cftc-forex-advisory",
      "cftc-futures-basics",
      "investor-gov-crypto-related",
    ],
  },
  {
    id: "forex-is-sports-betting-in-a-suit",
    topic: "cross-system",
    claim: "Forex is just sports betting in a suit.",
    verdict: "Misleading",
    correction:
      "They are different mechanisms — but both involve uncertainty, and speculative behaviour in either can be harmful.",
    explanation:
      "Currency exchange serves payments and business needs and can be a genuine exchange of money; margin forex is a contract with a dealer on rate movements. A wager is an agreement about an event's outcome settled by an operator's rules, with no claim on any asset. Different objects, purposes and settlement. The behaviours that cause harm — chasing losses, trusting hype — can appear in both, but that comparison is this site's own explanation, not a finding of the cited sources.",
    sourceIds: ["moneysmart-forex", "cftc-forex-advisory", "phe-gambling-harms-review"],
  },
  {
    id: "research-guarantees-profit",
    topic: "cross-system",
    claim: "If you do enough research, profit is guaranteed.",
    verdict: "False",
    correction: "Research can improve understanding, but it never removes uncertainty.",
    explanation:
      "Prices reflect many factors and many other participants' expectations. Australia's consumer regulator says even the most experienced traders have difficulty predicting currency movements, and it warns against any course, signal service or tool that claims accurate prediction.",
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "leverage-free-money",
    topic: "forex",
    claim: "Leverage creates free money.",
    verdict: "False",
    correction: "Leverage magnifies losses as much as gains, and costs apply either way.",
    explanation:
      "Controlling a large position with a small deposit means small adverse moves can use up the deposit. Providers may demand more money at short notice or close the position, and with some products losses can exceed what was put in.",
    sourceIds: ["cftc-forex-advisory", "moneysmart-forex"],
  },
  {
    id: "forex-means-owning-currency",
    topic: "forex",
    claim: "Forex trading means you actually own the foreign currency.",
    verdict: "Incomplete",
    correction:
      "Exchanging currency does transfer it; retail margin forex is generally a contract with a dealer on price movement, without owning the currency.",
    explanation:
      "Moneysmart describes margin forex as generally a CFD that lets people speculate without owning the underlying currency, and the CFTC notes that in off-exchange retail forex you trade against the dealer. Mixing this up hides who your counterparty is and what protections apply.",
    sourceIds: ["moneysmart-forex", "cftc-forex-advisory"],
  },
  {
    id: "signals-predict-prices",
    topic: "forex",
    claim: "Paid signals, copy-trading or AI tools can accurately predict currency moves.",
    verdict: "False",
    correction: "Be wary of any claim of accurate prediction; none can remove uncertainty.",
    explanation:
      "Moneysmart explicitly warns against claims that a course, trading signal service, copy-trading service, program or AI tool can accurately predict movements in foreign currencies, and notes scammers use fake platforms and promises of easy profits.",
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "shares-guarantee-gains",
    topic: "stocks",
    claim: "Owning a share guarantees growth or dividends.",
    verdict: "False",
    correction: "A share is an ownership interest; gains and dividends are possible, not promised.",
    explanation:
      "Stock prices move down as well as up and there is no guarantee that a company will grow. Dividends are decided by the company. If a company fails, common shareholders are paid last and may receive nothing.",
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "futures-equals-owning-goods",
    topic: "commodities",
    claim: "A commodity futures contract means you own the gold, cocoa or oil.",
    verdict: "Misleading",
    correction:
      "A futures contract is an agreement about a future date and price; many are closed out before delivery and some settle in cash.",
    explanation:
      "Physical goods have to be grown or mined, stored and moved. A futures contract is a standardised agreement with a fixed expiry, not a holding of the goods, so the two are not interchangeable.",
    sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
  },
  {
    id: "all-crypto-is-the-same",
    topic: "crypto",
    claim: "All crypto is the same: a blockchain coin that is basically a share in something.",
    verdict: "False",
    correction:
      "Networks and tokens differ widely; many tokens give no ownership of a business, and not every network is a blockchain.",
    explanation:
      "A crypto asset is defined as a digital representation of value on a distributed ledger. What it represents depends on its design. Shares in a crypto-related company are a different thing from the tokens themselves.",
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "famous-platform-means-protected",
    topic: "crypto",
    claim: "If a well-known platform holds it, my crypto is protected.",
    verdict: "Misleading",
    correction:
      'Platforms differ and may lack important investor protections; a "proof of reserves" is not the same as an audit.',
    explanation:
      "The SEC warns that platforms where people buy, sell, borrow or lend crypto asset securities may lack important protections, and that a proof of reserves is a limited snapshot rather than a full audit. Third-party custody means relying on the provider.",
    sourceIds: ["investor-gov-crypto-securities-alert", "investor-gov-crypto-related"],
  },
  {
    id: "betting-is-investing",
    topic: "sports-betting",
    claim: "Sports betting is just another form of investing.",
    verdict: "False",
    correction:
      "A wager creates no ownership claim on any asset; it is an agreement settled under an operator's rules.",
    explanation:
      "A share continues to represent a fraction of a business after you buy it. A wager ends when the outcome is settled, and its terms are set by an operator that is a commercial party with its own interests.",
    sourceIds: ["investor-gov-stocks", "phe-gambling-harms-review"],
  },
  {
    id: "streaks-are-due",
    topic: "sports-betting",
    claim: 'After a long losing streak, a win is "due".',
    verdict: "False",
    correction: "For independent chance events there is no memory; streaks happen by chance.",
    explanation:
      "A fair coin that has landed heads five times is still equally likely to land heads or tails next. Believing a change is due is a thinking error that can drive people to keep going to recover losses.",
    sourceIds: [],
  },
  {
    id: "legal-means-harmless",
    topic: "sports-betting",
    claim: "If gambling is legal and regulated, it is harmless.",
    verdict: "False",
    correction:
      "Legal status is not a safety guarantee; gambling-related harms are well documented.",
    explanation:
      "An English evidence review classes the harms by type — financial, relationship, mental and physical health, cultural, employment and education, and criminal activity — and notes harms reach families and close associates, though evidence on wider harms is limited.",
    sourceIds: ["phe-gambling-harms-review"],
  },
];
