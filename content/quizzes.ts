import type { QuizQuestion } from "@/lib/schemas";

/**
 * Every question explains the correct answer whether the learner is right or wrong. Options are
 * fixed (never shuffled) so results are deterministic. Numbers in prompts are fictional.
 */
export const quizzes: readonly QuizQuestion[] = [
  /* --------------------------------------------------------------- forex */
  {
    id: "forex-q1",
    topic: "forex",
    prompt: "In a fictional quote, USD/GHS = 10.00. What does that tell you?",
    options: [
      { id: "a", text: "One Ghana cedi is worth 10 US dollars." },
      { id: "b", text: "One US dollar is worth 10 Ghana cedis in this example." },
      { id: "c", text: "Twelve US dollars can never be exchanged for cedis." },
    ],
    correctOptionId: "b",
    explanation:
      "A pair is read as base/quote. The first currency (USD) is the base, and the number says how many units of the second (GHS) one unit of the base is worth. If the number rises, it takes more cedis to buy one dollar.",
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "forex-q2",
    topic: "forex",
    prompt: "Which best describes margin forex as offered by many retail providers?",
    options: [
      { id: "a", text: "Foreign banknotes delivered to your account." },
      { id: "b", text: "A government-guaranteed savings product." },
      {
        id: "c",
        text: "A contract with a dealer on exchange-rate movements, generally without owning the currency.",
      },
    ],
    correctOptionId: "c",
    explanation:
      "Australia's consumer regulator describes margin forex as generally a contract for difference that lets people speculate on rates without owning the currency, and the US CFTC notes that in off-exchange retail forex you trade against the dealer. That is different from exchanging currency to pay an invoice.",
    sourceIds: ["moneysmart-forex", "cftc-forex-advisory"],
  },
  {
    id: "forex-q3",
    topic: "forex",
    prompt: "What does leverage do?",
    options: [
      {
        id: "a",
        text: "It magnifies both gains and losses, and with some products losses can exceed the deposit.",
      },
      { id: "b", text: "It removes the risk of loss when an exchange rate moves." },
      { id: "c", text: "It only increases gains and never increases losses." },
    ],
    correctOptionId: "a",
    explanation:
      "Leverage lets a small amount of your own money control a much larger position, so small moves have large effects in both directions. The US CFTC warns you may owe more than your deposit, and Australia's Moneysmart warns a provider may demand more money at short notice or close your position. What applies depends on the product and the country.",
    sourceIds: ["cftc-forex-advisory", "moneysmart-forex"],
  },
  {
    id: "forex-q4",
    topic: "forex",
    prompt:
      "A fictional importer must pay a US-dollar invoice later. If the cedi weakens against the dollar before payment, what happens?",
    options: [
      { id: "a", text: "The invoice costs fewer cedis." },
      { id: "b", text: "Nothing changes, because the invoice is fixed in dollars." },
      { id: "c", text: "The same dollar invoice costs more cedis." },
    ],
    correctOptionId: "c",
    explanation:
      "The dollar amount stays the same, but the number of cedis needed to buy those dollars rises. That is currency risk, and it is why businesses care about exchange rates even when they have no interest in speculating.",
    sourceIds: [],
  },
  {
    id: "forex-q5",
    topic: "forex",
    prompt: "Which statement about predicting exchange rates is best supported?",
    options: [
      { id: "a", text: "Experienced traders can reliably predict them." },
      {
        id: "b",
        text: "Many factors affect rates and even experienced traders find movements hard to predict.",
      },
      { id: "c", text: "A paid signal service can guarantee the direction." },
    ],
    correctOptionId: "b",
    explanation:
      "Rates reflect supply and demand shaped by interest rates, trade and economic conditions, among other things. Moneysmart warns against claims that a course, signal service, copy-trading service or AI tool can accurately predict currency movements.",
    sourceIds: ["moneysmart-forex"],
  },

  /* -------------------------------------------------------------- stocks */
  {
    id: "stocks-q1",
    topic: "stocks",
    prompt: "What does owning a share of a company give you?",
    options: [
      { id: "a", text: "A loan to the company that is repaid with interest." },
      { id: "b", text: "A guaranteed share of future profits." },
      {
        id: "c",
        text: "A fractional ownership interest, with no guarantee of gains or dividends.",
      },
    ],
    correctOptionId: "c",
    explanation:
      "A stock is a security giving a share of ownership. Prices move down as well as up, dividends are not guaranteed, and money can be lost.",
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "stocks-q2",
    topic: "stocks",
    prompt: "A fictional company has 1,000 shares and you hold 25. What fraction do you own?",
    options: [
      { id: "a", text: "2.5%" },
      { id: "b", text: "25%" },
      { id: "c", text: "0.25%" },
    ],
    correctOptionId: "a",
    explanation:
      "25 ÷ 1,000 = 0.025, which is 2.5%. Your stake is a fraction of the whole company, and its value depends on what the company is worth, not on the number of shares alone.",
    sourceIds: [],
  },
  {
    id: "stocks-q3",
    topic: "stocks",
    prompt:
      "If a company fails and its assets are sold, where do common shareholders rank in being paid?",
    options: [
      { id: "a", text: "First, ahead of everyone else." },
      {
        id: "b",
        text: "Last — after creditors and preferred holders — and they may receive nothing.",
      },
      { id: "c", text: "Equal with bondholders." },
    ],
    correctOptionId: "b",
    explanation:
      "Bondholders are paid first, then preferred stockholders; common stockholders get whatever is left, which may be nothing. This is why owning a share can mean losing the whole amount.",
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "stocks-q4",
    topic: "stocks",
    prompt: "What is a dividend?",
    options: [
      {
        id: "a",
        text: "A payment some companies choose to make from earnings; it is not guaranteed.",
      },
      { id: "b", text: "A payment every company must make each year." },
      { id: "c", text: "The same thing as the share price going up." },
    ],
    correctOptionId: "a",
    explanation:
      "Companies decide whether to pay dividends, and may reduce or stop them. A share price rising (capital appreciation) is a separate thing from a dividend.",
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "stocks-q5",
    topic: "stocks",
    prompt: "Why does a share price change from day to day?",
    options: [
      { id: "a", text: "The exchange sets a new price each morning." },
      { id: "b", text: "Regulators decide it." },
      {
        id: "c",
        text: "Buyers and sellers change their assessments as news, earnings and market conditions change.",
      },
    ],
    correctOptionId: "c",
    explanation:
      "A price is where buyers and sellers meet. A stock's price can be affected by factors inside the company, such as a faulty product, and by events outside its control, such as political or market events.",
    sourceIds: ["investor-gov-stocks"],
  },

  /* --------------------------------------------------------- commodities */
  {
    id: "commodities-q1",
    topic: "commodities",
    prompt: "What is the difference between a spot price and a futures contract?",
    options: [
      { id: "a", text: "There is none; they are the same thing." },
      {
        id: "b",
        text: "Spot is for delivery now; a futures contract is an agreement for a later date at a price fixed today.",
      },
      { id: "c", text: "Futures contracts are bags of goods stored at your home." },
    ],
    correctOptionId: "b",
    explanation:
      "A futures contract fixes price and quantity now for a future date. Many are closed out before delivery and some are settled in cash, so holding one is not the same as owning the goods.",
    sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
  },
  {
    id: "commodities-q2",
    topic: "commodities",
    prompt:
      "A fictional cocoa cooperative uses a contract to reduce uncertainty about its future selling price. What is this called?",
    options: [
      { id: "a", text: "Speculation" },
      { id: "b", text: "Arbitrage" },
      { id: "c", text: "Hedging" },
    ],
    correctOptionId: "c",
    explanation:
      "Hedgers manage price risk from a real business exposure. Hedging tends to reduce uncertainty by giving up some possible gain, and it can introduce other risks. Speculators, by contrast, take positions mainly to profit from price moves.",
    sourceIds: ["cftc-futures-basics"],
  },
  {
    id: "commodities-q3",
    topic: "commodities",
    prompt:
      "In a simple supply-and-demand toy model, a fictional drought cuts supply while demand stays the same. Which way do price pressures point?",
    options: [
      { id: "a", text: "Upward — scarcer supply raises the price people are willing to pay." },
      { id: "b", text: "Downward — less supply always means a lower price." },
      { id: "c", text: "There is no connection between supply and price." },
    ],
    correctOptionId: "a",
    explanation:
      "In the stylised model, less supply against steady demand puts upward pressure on price. Real prices also respond to inventories, demand changes, transport and expectations, so this is a teaching model and never a forecast.",
    sourceIds: [],
  },
  {
    id: "commodities-q4",
    topic: "commodities",
    prompt: "Which statement about futures trading is supported by US regulators' education pages?",
    options: [
      { id: "a", text: "It is risk-free because it takes place on an exchange." },
      { id: "b", text: "Losses can exceed the amount you first put in." },
      { id: "c", text: "Every contract must end in physical delivery." },
    ],
    correctOptionId: "b",
    explanation:
      "The CFTC describes futures trading as volatile, complex and risky, noting people can lose all their money and be required to pay more than they invested. Many contracts are closed out before delivery, and some are cash-settled.",
    sourceIds: ["cftc-futures-basics"],
  },
  {
    id: "commodities-q5",
    topic: "commodities",
    prompt: "In exchange-traded futures, what does a clearing corporation do?",
    options: [
      { id: "a", text: "Chooses which side will win." },
      { id: "b", text: "Guarantees every participant a profit." },
      { id: "c", text: "Acts as counterparty to each transaction and guarantees it is completed." },
    ],
    correctOptionId: "c",
    explanation:
      "Centralised clearing means a clearing corporation sits between buyer and seller, reducing the risk that one side fails to perform. It does not protect anyone from price losses.",
    sourceIds: ["investor-gov-commodities"],
  },

  /* -------------------------------------------------------------- crypto */
  {
    id: "crypto-q1",
    topic: "crypto",
    prompt: "Which description of a crypto asset is most accurate?",
    options: [
      {
        id: "a",
        text: "A digital representation of value recorded on a cryptographically secured distributed ledger.",
      },
      { id: "b", text: "Always a share in a company." },
      { id: "c", text: "Always backed by a government." },
    ],
    correctOptionId: "a",
    explanation:
      "That is the definition used by the US SEC's investor-education page. What a given token actually represents varies widely, and many carry no ownership claim on a business or its cash flows.",
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "crypto-q2",
    topic: "crypto",
    prompt: "Conceptually, what is a private key?",
    options: [
      { id: "a", text: "A public username anyone should know." },
      { id: "b", text: "A password you can safely share with a support agent." },
      { id: "c", text: "A secret that proves control; whoever holds it controls the asset." },
    ],
    correctOptionId: "c",
    explanation:
      "Crypto assets are accessed through a wallet using private keys or passcodes. Because control follows the key, losing it or having it stolen can mean losing the asset, so it is kept secret.",
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "crypto-q3",
    topic: "crypto",
    prompt:
      "You own shares of a listed company that works in the crypto industry. Do you directly own crypto assets?",
    options: [
      { id: "a", text: "Yes, exactly as if you held the tokens." },
      {
        id: "b",
        text: "No — you own part of the company, and its share price can move independently of crypto prices.",
      },
      { id: "c", text: "Only if the company pays a dividend." },
    ],
    correctOptionId: "b",
    explanation:
      "The SEC's page points out that shareholders in such a company do not directly own any crypto assets, and its shares may trade higher or lower independent of the price of any crypto asset.",
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "crypto-q4",
    topic: "crypto",
    prompt: "What is the key difference between self-custody and third-party custody?",
    options: [
      {
        id: "a",
        text: "With self-custody you alone control the keys and carry the responsibility; with a third party you rely on the provider.",
      },
      { id: "b", text: "Both are fully insured against any loss." },
      { id: "c", text: "There is no difference between them." },
    ],
    correctOptionId: "a",
    explanation:
      "Each choice has its own risks: lose your keys and no one can restore them, or rely on a provider that may fail, be hacked or lack protections. Neither is automatically insured.",
    sourceIds: ["investor-gov-crypto-related"],
  },
  {
    id: "crypto-q5",
    topic: "crypto",
    prompt: 'A platform advertises a "proof of reserves". What is the most accurate view?',
    options: [
      { id: "a", text: "It is the same as a full independent audit." },
      { id: "b", text: "It guarantees customers can always withdraw." },
      {
        id: "c",
        text: "It is a limited snapshot that is not as rigorous as an audit and may give little real assurance.",
      },
    ],
    correctOptionId: "c",
    explanation:
      "The SEC's investor alert explains that proof-of-reserves may show only a point-in-time snapshot, may omit liabilities, and has no specific audit requirements, so it does not replace audited financial statements.",
    sourceIds: ["investor-gov-crypto-securities-alert"],
  },

  /* ------------------------------------------------------ sports betting */
  {
    id: "sports-betting-q1",
    topic: "sports-betting",
    prompt: "Making a wager gives you which of these?",
    options: [
      { id: "a", text: "A share in the operator's business." },
      {
        id: "b",
        text: "No ownership stake in any company, currency or commodity — it is an agreement settled under the operator's rules.",
      },
      { id: "c", text: "A holding of currency or a commodity." },
    ],
    correctOptionId: "b",
    explanation:
      "A wager is an agreement about a defined outcome. It creates no claim on a company, currency or commodity, and it ends when the outcome is settled.",
    sourceIds: [],
  },
  {
    id: "sports-betting-q2",
    topic: "sports-betting",
    prompt: "A fair coin lands heads five times in a row. What about the next flip?",
    options: [
      { id: "a", text: "Heads and tails are still equally likely." },
      { id: "b", text: 'Tails is now more likely because it is "due".' },
      { id: "c", text: "Heads is now certain." },
    ],
    correctOptionId: "a",
    explanation:
      'For independent chance events there is no memory. Sporting results are not coin flips, but the point carries over: a past streak does not make a change "due", and believing it does is a well-known thinking error that can push people to chase losses.',
    sourceIds: [],
  },
  {
    id: "sports-betting-q3",
    topic: "sports-betting",
    prompt: "If a form of gambling is legal and regulated, what follows?",
    options: [
      { id: "a", text: "It cannot cause harm." },
      { id: "b", text: "It guarantees a fair return to participants." },
      {
        id: "c",
        text: "Nothing about safety follows: gambling-related harms to finances, relationships and health are documented.",
      },
    ],
    correctOptionId: "c",
    explanation:
      "An English evidence review groups gambling-related harms into financial, relationship, mental and physical health, cultural, employment and education, and criminal-activity types, and notes harms can reach families and close associates. Legal status is not a safety guarantee.",
    sourceIds: ["phe-gambling-harms-review"],
  },
  {
    id: "sports-betting-q4",
    topic: "sports-betting",
    prompt: "Which best distinguishes a wager from buying a share of a company?",
    options: [
      { id: "a", text: "Both give you an ownership claim." },
      {
        id: "b",
        text: "A share is an ownership stake that continues to exist; a wager is an agreement that ends at settlement.",
      },
      { id: "c", text: "There is no difference." },
    ],
    correctOptionId: "b",
    explanation:
      "Equity represents a continuing fractional interest in a business. A wager creates no continuing claim on anything: once the outcome is settled under the operator's rules, it is over.",
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "sports-betting-q5",
    topic: "sports-betting",
    prompt: 'An online post claims a "system that never loses". What is the sensible response?',
    options: [
      {
        id: "a",
        text: "Treat it as unsupported: ask what is being sold, who benefits, and where the evidence is, and remember losses are rarely posted.",
      },
      { id: "b", text: "Believe it if there are screenshots of wins." },
      { id: "c", text: "Pass it on to friends so they can benefit too." },
    ],
    correctOptionId: "a",
    explanation:
      'Claims of guaranteed results are a classic warning sign. Screenshots show only selected outcomes, and anyone selling a "system" profits from your attention or money whether it works or not. Passing it on only spreads an unsupported claim.',
    sourceIds: [],
  },

  /* -------------------------------------------------------- cross-system */
  {
    id: "cross-q1",
    topic: "cross-system",
    prompt: "Which of these gives you a fractional ownership interest in a business?",
    options: [
      { id: "a", text: "A share of stock" },
      { id: "b", text: "A forex position" },
      { id: "c", text: "A wager" },
      { id: "d", text: "A futures contract" },
    ],
    correctOptionId: "a",
    explanation:
      "Only equity represents ownership of a company. A currency position, a futures contract and a wager are different objects, none of which is an ownership stake.",
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "cross-q2",
    topic: "cross-system",
    prompt: '"It involves a real asset, so it is safe." What is wrong with this claim?',
    options: [
      { id: "a", text: "Nothing — real assets cannot lose value." },
      {
        id: "b",
        text: "Real economic purpose does not remove price losses, leverage, fraud, fees or behavioural risk.",
      },
      { id: "c", text: "Only crypto can lose value." },
    ],
    correctOptionId: "b",
    explanation:
      "Shares can fall to nothing, leveraged currency and futures positions can lose more than the deposit, crypto can be volatile and custody can fail, and scams occur around all of them. Purpose and risk are separate questions.",
    sourceIds: [
      "investor-gov-stocks",
      "moneysmart-forex",
      "cftc-futures-basics",
      "investor-gov-crypto-related",
    ],
  },
  {
    id: "cross-q3",
    topic: "cross-system",
    prompt: "A cost built into most currency quotes before any price movement is the:",
    options: [
      { id: "a", text: "Dividend" },
      { id: "b", text: "Spread" },
      { id: "c", text: "Clearing corporation" },
      { id: "d", text: "Private key" },
    ],
    correctOptionId: "b",
    explanation:
      "Dealers quote one price to buy and a higher one to sell; the gap is the spread. Spreads, commissions and financing costs add up, especially for frequent traders.",
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "cross-q4",
    topic: "cross-system",
    prompt: "Which phrase should make you most sceptical?",
    options: [
      { id: "a", text: '"Prices can fall as well as rise."' },
      { id: "b", text: '"Read the risk disclosure before deciding."' },
      { id: "c", text: '"Guaranteed returns with no risk."' },
      { id: "d", text: '"Fees and spreads apply."' },
    ],
    correctOptionId: "c",
    explanation:
      "Nothing speculative can honestly promise returns with no risk. The CFTC (via the SEC's Investor.gov page) singles out high-yield offers in futures and forex as common areas of fraud, and the SEC warns that platforms for crypto asset securities may lack important investor protections.",
    sourceIds: ["investor-gov-commodities", "investor-gov-crypto-securities-alert"],
  },
  {
    id: "cross-q5",
    topic: "cross-system",
    prompt: "Does leverage create free money?",
    options: [
      { id: "a", text: "Yes, because you control more with less." },
      { id: "b", text: "No — it magnifies losses as well as gains, and costs still apply." },
      { id: "c", text: "Yes, but only in forex." },
    ],
    correctOptionId: "b",
    explanation:
      "Leverage multiplies exposure, not skill or certainty. Small adverse moves can use up a deposit, and you may be required to add money or have the position closed; with some products you can owe more than you put in.",
    sourceIds: ["cftc-forex-advisory", "moneysmart-forex"],
  },
  {
    id: "cross-q6",
    topic: "cross-system",
    prompt: "Which statement is true of every system on this site, including wagering?",
    options: [
      { id: "a", text: "Outcomes are uncertain and participants can lose money." },
      { id: "b", text: "The same rules and protections apply to all of them." },
      { id: "c", text: "Experience eliminates the chance of loss." },
    ],
    correctOptionId: "a",
    explanation:
      "The mechanisms differ — currency, ownership, goods, tokens, a wager — but uncertainty and the possibility of loss are common. Protections and rules differ by system and by country.",
    sourceIds: ["moneysmart-forex", "investor-gov-stocks", "phe-gambling-harms-review"],
  },
];

export const quizzesByTopic = (topic: string): QuizQuestion[] =>
  quizzes.filter((q) => q.topic === topic);
