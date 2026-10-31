import { GlossaryTermSchema, type GlossaryTerm, type GlossaryTermInput } from "@/lib/schemas";

/**
 * Plain-language definitions. Terms with `sourceIds` are supported by a verified page in
 * content/sources.ts; the rest are general definitions kept deliberately neutral and non-technical.
 */
const terms: readonly GlossaryTermInput[] = [
  /* ------------------------------------------------------------- general */
  {
    id: "market",
    term: "Market",
    definition:
      "Any arrangement that lets buyers and sellers find each other and agree a price. A market can be a place, a screen or a network; what matters is that prices and information flow between the people taking part.",
  },
  {
    id: "price",
    term: "Price",
    definition:
      "The amount of one thing (usually money) that people agree to give for another. In a market, prices move as buyers and sellers change their minds about what something is worth.",
  },
  {
    id: "liquidity",
    term: "Liquidity",
    definition:
      "How easily something can be bought or sold quickly without moving its price much. When liquidity is thin, trades can be delayed or can only be done at a worse price.",
    related: ["spread", "volatility"],
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "volatility",
    term: "Volatility",
    definition:
      "How much and how fast a price moves around. High volatility means big swings in short periods, which raises the chance of large losses as well as large gains.",
    related: ["risk", "liquidity"],
    sourceIds: ["moneysmart-forex", "investor-gov-crypto-related"],
  },
  {
    id: "risk",
    term: "Risk",
    definition:
      "The chance that an outcome is worse than hoped for, including losing some or all of the money involved. Risk is not the same as certainty of loss, and it is not the same in every system.",
    related: ["volatility", "uncertainty"],
  },
  {
    id: "uncertainty",
    term: "Uncertainty",
    definition:
      "Not knowing how something will turn out. Having more information can reduce uncertainty, but it rarely removes it, especially for prices and sporting results.",
    related: ["risk", "probability"],
  },
  {
    id: "spread",
    term: "Spread (bid–ask spread)",
    definition:
      "The gap between the price a dealer will pay to buy something (the bid) and the price at which it will sell it (the ask). The spread is a cost built into every exchange before any price movement.",
    topics: ["forex"],
    related: ["fee", "liquidity"],
    sourceIds: ["moneysmart-forex", "cftc-forex-advisory"],
  },
  {
    id: "fee",
    term: "Fees and costs",
    definition:
      "Charges taken for providing a service: commissions, spreads, financing costs, storage, network fees and similar. Costs apply whether or not the price moves your way.",
    related: ["spread"],
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "leverage",
    term: "Leverage",
    definition:
      "Controlling a larger position with a smaller amount of your own money, usually by borrowing or by posting a deposit. Leverage magnifies gains and losses alike, and with some products losses can exceed the money you put in.",
    topics: ["forex", "commodities"],
    related: ["margin", "risk"],
    sourceIds: ["moneysmart-forex", "cftc-forex-advisory", "cftc-futures-basics"],
  },
  {
    id: "margin",
    term: "Margin",
    definition:
      "The deposit a provider requires you to put up to hold a leveraged position. If the position moves against you, the provider may ask for more money at short notice or close the position.",
    topics: ["forex", "commodities"],
    related: ["leverage"],
    sourceIds: ["cftc-forex-advisory", "moneysmart-forex"],
  },
  {
    id: "speculation",
    term: "Speculation",
    definition:
      "Taking a position mainly because you expect a price to move in a particular direction, rather than because you need the underlying thing. Speculation is a use of a market, not its original purpose.",
    related: ["hedging"],
  },
  {
    id: "hedging",
    term: "Hedging",
    definition:
      "Using an arrangement to reduce exposure to a price you cannot control, such as an exchange rate or a crop price. Hedging usually reduces uncertainty by giving up some possible gain, and it can introduce other risks.",
    topics: ["forex", "commodities"],
    related: ["speculation", "futures-contract"],
    sourceIds: ["cftc-futures-basics"],
  },
  {
    id: "counterparty",
    term: "Counterparty",
    definition:
      "The other side of an agreement. In retail off-exchange forex the counterparty is the dealer; in exchange-traded futures a clearing corporation steps in between buyer and seller.",
    related: ["clearing-corporation"],
    sourceIds: ["cftc-forex-advisory", "investor-gov-commodities"],
  },
  {
    id: "derivative",
    term: "Derivative",
    definition:
      "A contract whose value depends on something else, such as an exchange rate or a commodity price. Holding a derivative is not the same as owning the underlying thing.",
    topics: ["forex", "commodities"],
    related: ["futures-contract"],
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "custody",
    term: "Custody",
    definition:
      "Who holds and controls an asset. Your bank holds your cash; a broker may hold your shares; with crypto you may hold the keys yourself or rely on a provider. The arrangement determines who can lose or protect it.",
    related: ["self-custody", "wallet"],
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "diversification",
    term: "Diversification",
    definition:
      "Spreading money across different holdings so that one failure matters less. It can reduce some risks, but it does not remove risk or guarantee against loss.",
    topics: ["stocks"],
    sourceIds: ["investor-gov-stocks"],
  },

  /* --------------------------------------------------------------- forex */
  {
    id: "exchange-rate",
    term: "Exchange rate",
    definition:
      "The price of one currency in terms of another. It tells you how many units of one currency are needed to get one unit of the other.",
    topics: ["forex"],
    related: ["currency-pair", "base-currency", "quote-currency"],
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "currency-pair",
    term: "Currency pair",
    definition:
      "Two currencies quoted against each other, such as USD/GHS. A rate only makes sense as a pair, because a currency is always priced in another currency.",
    topics: ["forex"],
    related: ["base-currency", "quote-currency"],
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "base-currency",
    term: "Base currency",
    definition:
      "The first currency in a pair. In USD/GHS the US dollar is the base: the quote tells you what one dollar is worth.",
    topics: ["forex"],
    related: ["quote-currency"],
  },
  {
    id: "quote-currency",
    term: "Quote currency",
    definition:
      "The second currency in a pair, in which the price is expressed. In USD/GHS the Ghana cedi is the quote currency: the number is how many cedis one dollar is worth.",
    topics: ["forex"],
    related: ["base-currency"],
  },
  {
    id: "central-bank",
    term: "Central bank",
    definition:
      "A country's main monetary authority. It sets interest-rate policy and may take other actions that affect the value of the national currency.",
    topics: ["forex"],
    related: ["interest-rate", "inflation"],
  },
  {
    id: "interest-rate",
    term: "Interest rate",
    definition:
      "The price of borrowing money, expressed as a percentage over time. Differences in interest rates between countries are one of the factors that can influence exchange rates.",
    topics: ["forex", "stocks"],
    related: ["central-bank", "inflation"],
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "inflation",
    term: "Inflation",
    definition:
      "A general rise in prices over time, which reduces what a unit of money can buy. Expectations about inflation can influence interest rates and currencies.",
    topics: ["forex"],
    related: ["interest-rate", "central-bank"],
  },
  {
    id: "currency-risk",
    term: "Currency risk",
    definition:
      "The risk that a change in an exchange rate makes something cost more or earn less in your own currency. Importers and exporters face it whenever invoices are in a foreign currency.",
    topics: ["forex"],
    related: ["hedging", "exchange-rate"],
  },
  {
    id: "contract-for-difference",
    term: "Contract for difference (CFD)",
    definition:
      "A contract paying the difference in a price between two moments, without the holder owning the underlying thing. Australia's consumer regulator describes margin forex as generally a type of CFD.",
    topics: ["forex"],
    related: ["derivative", "leverage"],
    sourceIds: ["moneysmart-forex"],
  },

  /* -------------------------------------------------------------- stocks */
  {
    id: "share",
    term: "Share (stock)",
    definition:
      "A unit of ownership in a company. Owning shares gives you a fractional stake in the business, possibly including voting rights and dividends, but no guarantee of either gains or dividends.",
    topics: ["stocks"],
    related: ["equity", "shareholder", "dividend"],
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "equity",
    term: "Equity",
    definition:
      "Ownership value in a company. Stocks are also called equities because they represent an ownership interest rather than a loan to the company.",
    topics: ["stocks"],
    related: ["share"],
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "shareholder",
    term: "Shareholder",
    definition:
      "A person or organisation that owns shares in a company. Common shareholders are paid after creditors if a company fails, and may receive nothing.",
    topics: ["stocks"],
    related: ["share"],
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "dividend",
    term: "Dividend",
    definition:
      "A payment a company may choose to make to shareholders out of its earnings. Dividends are not guaranteed and can be reduced or stopped.",
    topics: ["stocks"],
    related: ["share", "earnings"],
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "issuer",
    term: "Issuer",
    definition:
      "The company or organisation that creates and sells a security to raise money, for example by issuing new shares.",
    topics: ["stocks"],
    related: ["share"],
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "exchange",
    term: "Exchange",
    definition:
      "An organised marketplace with set rules where buyers and sellers trade standardised products such as shares or futures contracts.",
    topics: ["stocks", "commodities"],
    related: ["broker"],
    sourceIds: ["investor-gov-commodities"],
  },
  {
    id: "broker",
    term: "Broker",
    definition:
      "A firm that carries out purchases and sales for clients on a market. Brokers charge fees or take a spread for doing so, and they do not remove market risk.",
    topics: ["stocks"],
    related: ["exchange", "fee"],
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "earnings",
    term: "Earnings",
    definition:
      "A company's profit over a period. Expected and reported earnings are among the many things that change what investors think a company is worth.",
    topics: ["stocks"],
    related: ["dividend", "valuation"],
  },
  {
    id: "valuation",
    term: "Valuation",
    definition:
      "An estimate of what a company is worth. Different people value the same company differently, which is why a share price is the result of many opinions rather than a fixed fact.",
    topics: ["stocks"],
    related: ["market-capitalisation", "earnings"],
  },
  {
    id: "market-capitalisation",
    term: "Market capitalisation",
    definition:
      "The share price multiplied by the number of shares in existence: the market's current total price tag on the company. It is a price, not a measure of cash the company holds.",
    topics: ["stocks"],
    related: ["share", "valuation"],
  },

  /* --------------------------------------------------------- commodities */
  {
    id: "commodity",
    term: "Commodity",
    definition:
      "A basic good that is largely interchangeable with others of the same grade, such as cocoa, gold, oil or wheat. Metals, grains and other foods are traded in futures markets.",
    topics: ["commodities"],
    related: ["spot-price", "futures-contract"],
    sourceIds: ["investor-gov-commodities"],
  },
  {
    id: "spot-price",
    term: "Spot price",
    definition:
      "The price for buying or selling a commodity or currency for delivery now (or very soon). It is not the same as a futures price, which is for delivery at a later date.",
    topics: ["commodities", "forex"],
    related: ["futures-contract"],
  },
  {
    id: "futures-contract",
    term: "Futures contract",
    definition:
      "An agreement to buy or sell a set quantity of something at a price fixed now, on a date in the future. Many are closed out before delivery and some are settled in cash. It is not the same as owning the goods.",
    topics: ["commodities"],
    related: ["spot-price", "settlement", "clearing-corporation"],
    sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
  },
  {
    id: "settlement",
    term: "Settlement",
    definition:
      "How and when an agreement is completed: delivery of goods or currency, a payment in cash, or the resolution of an outcome. In a currency exchange the currencies are delivered; in futures it may be physical delivery or cash; in a wager it is the payment decided by the operator's rules.",
    topics: ["forex", "commodities", "sports-betting"],
    related: ["futures-contract", "wager"],
    sourceIds: ["cftc-futures-basics"],
  },
  {
    id: "clearing-corporation",
    term: "Clearing corporation",
    definition:
      "In exchange-traded futures, an organisation that acts as the counterparty to every transaction and guarantees it is completed. It reduces the risk that one participant fails to perform.",
    topics: ["commodities"],
    related: ["counterparty", "exchange"],
    sourceIds: ["investor-gov-commodities"],
  },
  {
    id: "supply-chain",
    term: "Supply chain",
    definition:
      "The series of steps that moves a good from producer to final user: growing or mining, processing, storage, transport and sale. A disruption at one step can affect availability and price further along.",
    topics: ["commodities"],
    related: ["inventory"],
  },
  {
    id: "inventory",
    term: "Inventory (stocks of goods)",
    definition:
      "The amount of a good held in storage. Low inventories can make supply feel tighter; high inventories can make it feel looser. Not to be confused with company shares.",
    topics: ["commodities"],
    related: ["supply-chain"],
  },

  /* -------------------------------------------------------------- crypto */
  {
    id: "crypto-asset",
    term: "Crypto asset",
    definition:
      "A digital representation of value recorded on a cryptographically secured distributed ledger. Crypto assets can be volatile and lose money, and they differ widely in what, if anything, they represent.",
    topics: ["crypto"],
    related: ["token", "distributed-ledger"],
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "distributed-ledger",
    term: "Distributed ledger",
    definition:
      "A record shared and kept in step by many computers rather than held by a single organisation. Participants follow agreed rules to add new entries.",
    topics: ["crypto"],
    related: ["blockchain", "consensus"],
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "blockchain",
    term: "Blockchain",
    definition:
      "One design of distributed ledger in which entries are grouped into blocks linked in sequence. Not every crypto network is a blockchain, and not every blockchain works the same way.",
    topics: ["crypto"],
    related: ["distributed-ledger"],
  },
  {
    id: "token",
    term: "Token",
    definition:
      "A unit recorded on a network's ledger. What a token represents varies enormously: some give access to a service, some are traded purely as assets, and many carry no ownership of a business or any claim on cash flows.",
    topics: ["crypto"],
    related: ["crypto-asset"],
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "private-key",
    term: "Private key",
    definition:
      "A secret used to prove you control something recorded on a network. Whoever holds the key controls the asset, so losing it or having it stolen can mean losing the asset for good.",
    topics: ["crypto"],
    related: ["wallet", "self-custody"],
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "wallet",
    term: "Wallet",
    definition:
      "Software or a device that holds the keys used to access crypto assets. It does not literally contain coins; it controls access to entries on the ledger.",
    topics: ["crypto"],
    related: ["private-key", "custody"],
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "self-custody",
    term: "Self-custody",
    definition:
      "Holding your own keys so that you alone control an asset. It removes reliance on a provider but makes you fully responsible for security and for mistakes.",
    topics: ["crypto"],
    related: ["custody", "private-key"],
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "consensus",
    term: "Consensus",
    definition:
      "The method by which a network's participants agree on which entries are valid and in what order. Different networks use different methods.",
    topics: ["crypto"],
    related: ["distributed-ledger", "validation"],
  },
  {
    id: "validation",
    term: "Validation",
    definition:
      "Checking that a proposed entry follows the network's rules — for example, that the sender is authorised and the value has not already been used — before it is added to the ledger.",
    topics: ["crypto"],
    related: ["consensus"],
  },
  {
    id: "smart-contract",
    term: "Smart contract",
    definition:
      "A program stored on a network that runs automatically when its conditions are met. Errors in the code, or in how it is used, can lead to losses that are hard or impossible to reverse.",
    topics: ["crypto"],
    related: ["token"],
  },

  /* ------------------------------------------------------ sports betting */
  {
    id: "wager",
    term: "Wager",
    definition:
      "Money committed on a defined outcome under an operator's rules, to be paid or lost when the outcome is settled. A wager gives no ownership of any company, currency or commodity.",
    topics: ["sports-betting"],
    related: ["operator", "settlement"],
  },
  {
    id: "operator",
    term: "Operator",
    definition:
      "The business that offers wagers, writes the rules and settles outcomes. The operator is a commercial party with its own interests, not a neutral referee.",
    topics: ["sports-betting"],
    related: ["wager", "operator-margin"],
  },
  {
    id: "operator-margin",
    term: "Operator margin",
    definition:
      "The built-in advantage an operator keeps so that, over many participants and many events, it is expected to come out ahead. It is why winning consistently over time is hard for participants as a group.",
    topics: ["sports-betting"],
    related: ["operator", "wager"],
  },
  {
    id: "probability",
    term: "Probability",
    definition:
      "A number between 0 and 1 (or 0% and 100%) describing how likely something is. A likely thing can still fail to happen and an unlikely thing can happen.",
    topics: ["sports-betting"],
    related: ["uncertainty", "variance"],
  },
  {
    id: "variance",
    term: "Variance (streaks and swings)",
    definition:
      'The natural spread of results around what you would expect on average. Short runs of the same result happen by chance and do not mean the next result is "due" to change.',
    topics: ["sports-betting"],
    related: ["probability", "uncertainty"],
  },
  {
    id: "gambling-related-harm",
    term: "Gambling-related harm",
    definition:
      "Negative effects of gambling on the health and wellbeing of individuals, families and communities. An English evidence review groups them as financial, relationship, mental and physical health, cultural, employment and education, and criminal-activity harms.",
    topics: ["sports-betting"],
    related: ["wager", "risk"],
    sourceIds: ["phe-gambling-harms-review"],
  },
];

/** Parsed at load so defaults apply and malformed entries fail the build immediately. */
export const glossary: readonly GlossaryTerm[] = terms.map((t) => GlossaryTermSchema.parse(t));

export const glossaryById = new Map(glossary.map((g) => [g.id, g] as const));
