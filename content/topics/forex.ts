import type { Lesson } from "@/lib/schemas";
import { REVIEWED, section } from "./helpers";

export const forex: Lesson = {
  id: "forex",
  title: "Forex: exchanging currency, or a contract on a rate",
  kicker: "Currency exchange",
  summary:
    "An exchange rate prices one currency against another. Paying an invoice can mean the currencies are delivered. Retail margin forex is generally a contract with a dealer, not delivery of the currency.",
  snapshot: {
    changesHands: "Currency — or, in retail margin forex, a contract about a rate.",
    purpose: "Paying across borders and managing currency risk; also speculation.",
    mainRisk: "Leverage magnifies losses, and rates are hard to predict.",
  },
  lastReviewed: REVIEWED,
  reviewNote:
    "Quote conventions, retail margin forex (a contract with a dealer, generally without owning the currency), leverage, costs, scams and difficulty of prediction are drawn from the ASIC Moneysmart and US CFTC pages listed below (the margin-FX-as-CFD description is Moneysmart's; the dealer-as-counterparty point is the CFTC's). General economic explanation not tied to a cited page, and flagged for editorial verification: that much trading is over the counter; that in a genuine exchange the currencies are delivered after a short settlement period; that inflation expectations, trade flows and sentiment influence rates; that businesses use arrangements to fix a rate in advance; that retail participants mostly speculate; and that a weaker currency can help exporters but hurt importers. Both sources are from Australia and the United States; nothing here describes Ghanaian law or what is permitted in Ghana.",
  sections: [
    section(
      "headline",
      "Forex, in plain words",
      [
        "Foreign exchange — forex or FX — is the global arrangement through which one country's money is exchanged for another's. If you have ever swapped cedis for dollars to pay a supplier abroad, or wondered what a price quoted in a foreign currency really costs at home, you have met an exchange rate.",
        "An exchange rate is simply a price: how much of one currency it takes to get one unit of another. Unlike a share or a bag of cocoa, a currency is always priced against another currency, which is why rates are written as pairs.",
        'The word "forex" is used for two quite different things, and mixing them up causes most of the confusion. One is the practical exchange of currency by businesses, travellers and banks. The other is retail forex trading, where people speculate on rate movements, usually through a contract with a dealer. This lesson explains both and keeps them apart.',
      ],
      { sourceIds: ["moneysmart-forex"] },
    ),
    section(
      "object",
      "What actually changes hands?",
      [
        "In a genuine exchange, currency itself changes hands. You give up one currency and receive another at a rate agreed at the time. A business paying a foreign invoice ends up holding less of its home currency, and the supplier really receives the foreign currency. A quote is only the price; settlement is the separate step in which the currencies are actually delivered, usually after a short settlement period.",
        'Retail forex trading is different. Australia\'s consumer regulator describes margin forex as generally a type of contract for difference: a contract that lets someone speculate on changes in exchange rates without owning the underlying currency. The US CFTC adds that in off-exchange retail forex you trade against your dealer, who is your counterparty. So "buying" a currency pair in a trading account is often an agreement with a firm about a price movement, not a delivery of cedis or dollars.',
      ],
      {
        callout: {
          label: "Keep these apart",
          text: "Exchanging currency to pay for something and entering a leveraged contract on a currency pair are different activities with different risks.",
        },
        sourceIds: ["moneysmart-forex", "cftc-forex-advisory"],
      },
    ),
    section(
      "purpose",
      "Why does the forex market exist?",
      [
        "Countries use different currencies, but trade and travel cross borders. Something has to let a Ghanaian importer pay a supplier invoiced in US dollars, let an exporter turn foreign earnings into the money that pays local wages, and let a family send money abroad. Currency exchange is that something.",
        "Businesses also use it to manage uncertainty. If you must pay 10,000 dollars in three months but the cedi price of a dollar might change, you face currency risk. Arrangements that fix or limit that exposure exist for this purpose; using them in this way is called hedging.",
        "Alongside these practical uses sits speculation: taking a position because you expect a rate to move. Speculation is a use of the market, not its purpose — and it is the part of forex that consumer regulators issue warnings about.",
      ],
      { usesIllustrativeNumbers: true, sourceIds: ["moneysmart-forex", "cftc-forex-advisory"] },
    ),
    section(
      "participants",
      "Who takes part, and why?",
      [
        "There is no single central marketplace. Much trading happens directly between parties through banks and dealers, rather than on one exchange, so the rate you get is the one your bank or dealer offers you.",
      ],
      {
        points: [
          "Banks and dealers quote rates and carry out exchanges, earning from spreads and fees.",
          "Importers and exporters need to pay or receive foreign currency to run their businesses.",
          "Central banks set interest-rate policy and sometimes act in currency markets.",
          "Institutions such as funds move money between currencies for investment reasons.",
          "Retail participants use trading platforms, mostly to speculate on rate changes.",
          "Travellers and families make small exchanges and cross-border payments.",
        ],
        sourceIds: ["cftc-forex-advisory"],
      },
    ),
    section(
      "mechanism",
      "How a rate is quoted and priced",
      [
        "A rate is quoted for a pair such as USD/GHS. The first currency is the base, the second the quote, and the number says how many units of the quote currency one unit of the base is worth. In our fictional example, USD/GHS 10.00 means one US dollar is worth 10 cedis.",
        "If the number rises to 11.00, the dollar has become more valuable in cedi terms: it takes more cedis to buy one dollar. We say the cedi has weakened against the dollar. The same move can be described the other way round — one cedi now buys fewer dollars — which is why the direction of a quote always depends on which currency is the base.",
        "Dealers quote two prices: a lower one at which they will buy the base currency and a higher one at which they will sell it. The gap is the spread, a cost built into every exchange before any rate movement. Commissions and financing costs can add to it.",
        "Rates reflect demand and supply for each currency. No one sets a single official price for the whole world; what applies to you is the price you are quoted.",
      ],
      { usesIllustrativeNumbers: true, sourceIds: ["moneysmart-forex"] },
    ),
    section(
      "influences",
      "What influences exchange rates?",
      [
        "Moneysmart summarises it simply: exchange rates reflect demand and supply for currencies and move with interest rates and with economic and trade conditions. Several kinds of forces matter, and none works alone.",
      ],
      {
        points: [
          "Interest rates and central-bank policy: differences between countries can change the appeal of holding each currency.",
          "Inflation expectations: persistent price rises erode what a currency buys.",
          "Trade flows: demand for a country's exports can create demand for its currency, and demand for imports creates demand for foreign currency.",
          "Economic growth and confidence in a country's prospects.",
          "News and sentiment, which can move rates quickly and sometimes briefly.",
        ],
        callout: {
          label: "Why prediction is hard",
          text: "No single factor sets tomorrow's rate, the factors interact, and even the most experienced traders have difficulty predicting movements.",
        },
        sourceIds: ["moneysmart-forex"],
      },
    ),
    section(
      "narrative",
      "A fictional importer",
      [
        "Imagine a small importer in Accra who orders kitchen equipment from an overseas supplier. The invoice is for 10,000 US dollars, due in 30 days. On the day the order is placed the fictional rate is USD/GHS 10.00, so the invoice would cost 100,000 cedis.",
        "A month later the fictional rate has moved to 10.50. The invoice is still 10,000 dollars, but it now costs 105,000 cedis: 5,000 more. Had the rate fallen to 9.50, it would have cost 95,000. The importer did nothing differently; the cost of the same invoice simply changed with the rate.",
        "This importer is not trying to profit from the rate. They want a predictable cost so they can price their goods. Businesses in this position have several ways to reduce the uncertainty, and which one suits them is a question for their bank or adviser, not something this lesson can recommend. (This is an invented story; it says nothing about how any real Ghanaian business pays its suppliers.) The point is why exchange rates matter to ordinary business long before anyone speculates.",
      ],
      { usesIllustrativeNumbers: true },
    ),
    section("misconceptions", "Common misconceptions", [
      "These ideas sound reasonable, and each one is either incomplete or wrong. Read the correction, not just the claim.",
    ]),
    section(
      "risks",
      "Risks and failure modes",
      [
        "Most of what regulators warn about concerns leveraged retail trading, not everyday currency exchange. Moneysmart puts it plainly: most retail investors find it difficult to make money from leveraged forex trading over the long term.",
      ],
      {
        points: [
          "Leverage: a small deposit controls a much larger position, so small moves have big effects. With some products losses can exceed the deposit (the CFTC warns you may owe more than you put in), and a provider can demand more money at short notice or close the position.",
          "Volatility: exchange rates can move a lot within very short periods.",
          "Costs: spreads, commissions and financing costs add up, particularly with frequent trading.",
          "Provider risk: if a provider fails, you may not get your money back; deposits may not be protected.",
          "Scams: fake platforms and promises of easy profits are used to lure people in; being registered does not by itself prevent fraud.",
          "Execution and liquidity: delays or system problems can stop you trading when you want to.",
          "Hype: be wary of claims that a course, signal service, copy-trading service or AI tool can accurately predict currency movements.",
        ],
        sourceIds: ["moneysmart-forex", "cftc-forex-advisory"],
      },
    ),
    section("check", "Check your understanding", [
      "Five short questions. Every answer — right or wrong — comes with an explanation, and you can retry as often as you like. Nothing is recorded unless you choose to save progress.",
    ]),
    section(
      "summary",
      "Summary and further reading",
      [
        "A currency rate is a price of one currency in another. Exchanging currency is how trade and travel are paid for; retail margin forex is generally a contract on rate movements, with a dealer as the other side. Leverage magnifies losses as well as gains, costs apply however the rate moves, and rates are genuinely hard to predict.",
      ],
      {
        points: [
          "A quote reads base/quote: the number is how many units of the quote currency one base unit is worth.",
          "Businesses face currency risk simply by being invoiced in a foreign currency.",
          "Retail margin forex is generally a contract, not a delivery of currency.",
          "Leverage and costs are what make retail forex particularly risky.",
        ],
      },
    ),
  ],
  actors: [
    {
      name: "Banks and dealers",
      role: "Quote rates, carry out exchanges and earn from spreads and fees.",
    },
    {
      name: "Importers and exporters",
      role: "Need to pay or receive foreign currency to run their businesses.",
    },
    { name: "Central banks", role: "Set interest-rate policy that can influence currency values." },
    { name: "Institutions", role: "Move money between currencies for investment reasons." },
    {
      name: "Retail participants",
      role: "Use platforms to exchange or, more often, to speculate on rates.",
    },
  ],
  misconceptions: [
    {
      claim: "Forex trading means you are actually buying foreign currency.",
      correction:
        "A genuine exchange does hand over currency, but retail margin forex is generally a contract with a dealer about price movement, without owning the currency.",
      sourceIds: ["moneysmart-forex", "cftc-forex-advisory"],
    },
    {
      claim: "A weaker currency is always bad and a stronger one is always good.",
      correction:
        "It depends who you are. A weaker cedi makes foreign invoices cost more for an importer, while an exporter paid in dollars may receive more cedis.",
      sourceIds: [],
    },
    {
      claim: "With enough research you can reliably predict exchange rates.",
      correction:
        "Rates reflect many interacting factors, and even the most experienced traders have difficulty predicting movements.",
      sourceIds: ["moneysmart-forex"],
    },
    {
      claim: "Leverage just means bigger profits.",
      correction:
        "Leverage magnifies losses exactly as it magnifies gains, and with some products you may owe more than your deposit.",
      sourceIds: ["cftc-forex-advisory", "moneysmart-forex"],
    },
    {
      claim: "If a platform is registered or regulated, I cannot lose money or be defrauded.",
      correction:
        "Registration does not prevent losses, and the CFTC notes that registration alone does not prevent fraud.",
      sourceIds: ["cftc-forex-advisory"],
    },
  ],
  glossaryTermIds: [
    "exchange-rate",
    "currency-pair",
    "base-currency",
    "quote-currency",
    "spread",
    "leverage",
    "margin",
    "hedging",
    "currency-risk",
    "central-bank",
    "contract-for-difference",
  ],
  quizIds: ["forex-q1", "forex-q2", "forex-q3", "forex-q4", "forex-q5"],
  readingSourceIds: ["moneysmart-forex", "cftc-forex-advisory"],
  labId: "fx-quote",
};
