import type { Lesson } from "@/lib/schemas";
import { REVIEWED, section } from "./helpers";

export const commodities: Lesson = {
  id: "commodities",
  title: "Commodities: real goods and the contracts around them",
  kicker: "Physical goods and futures",
  summary:
    "Commodities are basic goods like cocoa, gold, oil and wheat. The goods themselves and the financial contracts tied to them are different things with different obligations.",
  snapshot: {
    changesHands: "Physical goods — or futures contracts tied to them.",
    purpose: "Moves goods from producers to users and lets them manage price risk.",
    mainRisk: "Prices swing with supply and demand, and futures can lose more than was put in.",
  },
  lastReviewed: REVIEWED,
  reviewNote:
    "The definition and mechanics of futures contracts (set price and quantity, a later date, many closed out before delivery, some cash-settled), hedgers versus speculators, exchange trading, centralised clearing with a clearing corporation as counterparty, the risk of losses beyond the amount invested, and fraud warnings about high-yield futures and forex offers are drawn from the US CFTC and SEC pages listed below. The Investor.gov commodities page is about futures, not about owning physical goods. Statements about physical supply chains, margin as a deposit, currency and geopolitics as price drivers, how spot prices form from supply and demand, how futures and spot prices relate (including moving closer together near expiry), what influences commodity prices (weather, inventories, logistics, demand) and the cocoa cooperative narrative (entirely fictional) are general explanation flagged for editorial verification. No statement here is about the actual price, volume or regulation of any Ghanaian commodity.",
  sections: [
    section(
      "headline",
      "Commodities, in plain words",
      [
        "A commodity is a basic good that is largely interchangeable with other goods of the same grade: a tonne of a given grade of cocoa, an ounce of gold of a given purity, a barrel of a given type of oil. Metals, grains and other foods are among the things traded in futures markets.",
        "The word covers two quite different worlds. In one, people grow, mine, store and ship real goods. In the other, people trade contracts whose value follows the price of those goods. This lesson keeps them apart, because a contract on cocoa is not a bag of cocoa.",
      ],
      { sourceIds: ["investor-gov-commodities"] },
    ),
    section(
      "object",
      "What actually changes hands?",
      [
        "In the physical market, goods change hands: a cooperative sells beans, a processor takes delivery, and money moves the other way. The price paid for delivery now or very soon is called the spot price.",
        "A futures contract is an agreement to buy or sell a specific quantity of a commodity at a price fixed now, on a particular date in the future. According to the CFTC, price and quantity are fixed when the agreement is made, many contracts are closed out before any delivery takes place, and some are settled in cash instead. Holding one is not owning the goods.",
        "Exchange-traded futures come in a set unit size with a fixed expiration date, and they are cleared centrally: a clearing corporation acts as the counterparty to every transaction and guarantees it is completed.",
      ],
      {
        callout: {
          label: "Spot is not futures",
          text: "A spot price is for goods now. A futures contract is a standardised agreement about a later date. They can move differently, and they carry different obligations.",
        },
        sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
      },
    ),
    section(
      "purpose",
      "Why do commodity markets exist?",
      [
        "Real goods need to be produced, stored, transported and used, often months apart and continents apart. Farmers plant before they know what the harvest will sell for; manufacturers need to know what their ingredients will cost; traders and shippers connect the two.",
        "Futures markets let people who face a price risk transfer part of it. The CFTC identifies two broad groups: hedgers, such as producers or consumers managing price risk, and speculators, who aim to profit from price moves. Speculators are a use of the market rather than its purpose, and they take on the risk that hedgers want to shed.",
      ],
      { sourceIds: ["cftc-futures-basics"] },
    ),
    section(
      "participants",
      "Who takes part, and why?",
      [
        "A commodity travels through many hands, and different participants care about different parts of the journey.",
      ],
      {
        points: [
          "Farmers and miners produce the goods and worry about the price they will receive.",
          "Processors and manufacturers turn raw goods into products and worry about input costs.",
          "Traders, shippers and storage operators move and hold goods between producers and users.",
          "Hedgers use contracts to reduce exposure to price changes.",
          "Speculators take positions on price movements, accepting risk others want to pass on.",
          "Exchanges and clearing corporations provide the rules and the guarantee that trades are completed.",
        ],
        sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
      },
    ),
    section("mechanism", "How prices come about", [
      "Spot prices come from supply meeting demand at a particular place and time. If supply of a good tightens while demand stays the same, buyers must offer more to secure what is available and the price tends to rise; if supply is plentiful and demand weak, the price tends to fall.",
      "A futures price is the market's current agreement on what a later delivery should cost. It is influenced by the spot price but also by expectations about the future, by costs of storing and moving the goods, and by the terms of the contract. As the expiry date approaches, futures and spot prices tend to move closer together.",
      "This is a simplified picture. The lab on commodity supply shocks lets you move a fictional supply constraint and watch a stylised diagram respond; it is a teaching model, not a forecast.",
    ]),
    section(
      "influences",
      "What influences commodity prices?",
      [
        "Because commodities are physical, their prices are often tied to things that happen on farms, in mines and on shipping routes.",
      ],
      {
        points: [
          "Weather and harvests for crops such as cocoa and wheat.",
          "Mining output, disruptions and discoveries for metals.",
          "Inventories: how much is already in storage.",
          "Transport and logistics: delays, strikes, port or road problems.",
          "Demand from manufacturers and consumers, which can change with the economy.",
          "Geopolitics and trade rules.",
          "Currency movements, since many commodities are priced in a major foreign currency.",
        ],
        callout: {
          label: "No single driver",
          text: "These factors interact and their importance changes over time. Understanding them helps you read news; it does not let anyone forecast prices reliably.",
        },
      },
    ),
    section("narrative", "A fictional cocoa cooperative", [
      "Imagine a cocoa-growing cooperative that will harvest in six months. It worries that prices may be lower by then, which would leave too little to pay its members. A fictional chocolate manufacturer worries about the opposite: that prices will be higher and its costs will jump.",
      "Each wants less uncertainty. Contracts that fix a price in advance can let them do that. If the price later falls, the cooperative is glad it fixed a higher one; if it rises, the cooperative has given up the extra income it could have had, while the manufacturer is glad of its fixed cost. Hedging buys certainty by giving up some possible gain, and the contract itself can bring other risks.",
      "Meanwhile a speculator who has no beans to sell and no chocolate to make could take either side purely to profit from the price change. That is the difference in purpose: the cooperative and the manufacturer are managing a business risk; the speculator is adding a risk. This story is invented — it is not a description of how Ghanaian cocoa is actually sold — it contains no steps for doing any of it, and nothing here is a suggestion to do so.",
    ]),
    section("misconceptions", "Common misconceptions", [
      "Commodity talk mixes up goods and contracts. These are the mix-ups worth untangling.",
    ]),
    section(
      "risks",
      "Risks and failure modes",
      [
        "The CFTC describes futures and options trading as volatile, complex and risky, and says many people lose all their money and can be required to pay more than they invested.",
      ],
      {
        points: [
          "Price risk: commodity prices can swing sharply on weather, news and supply shocks.",
          "Leverage and margin: positions are usually held with a deposit much smaller than the contract's value, so losses can exceed the amount first put in.",
          "Mismatch: a contract's price and your real-world price can differ, so a hedge may not match your actual exposure.",
          "Physical costs: storage, insurance, transport and quality differences are real costs for the goods themselves.",
          "Fraud: the CFTC, as relayed on the SEC's Investor.gov page, cautions against offers of high yields in futures, options or forex, which it identifies as common areas of fraud.",
        ],
        sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
      },
    ),
    section("check", "Check your understanding", [
      "Five short questions with explanations after every answer. Retry as often as you like.",
    ]),
    section(
      "summary",
      "Summary and further reading",
      [
        "Commodities are real goods; futures are contracts about a later date and price. Producers and users manage price risk with them, speculators take the other side for profit, and physical supply and demand drive prices that swing considerably. The contracts are complex and can lose more than was put in.",
      ],
      {
        points: [
          "Spot means now; futures means a standardised agreement for a later date.",
          "A futures contract is not ownership of the goods; many are closed out or cash-settled.",
          "Hedging reduces uncertainty by giving up possible gain, and can bring other risks.",
          "Futures involve leverage and can lose more than the original deposit.",
        ],
      },
    ),
  ],
  actors: [
    {
      name: "Farmers and miners",
      role: "Produce the goods and face uncertainty about the price they will receive.",
    },
    {
      name: "Processors and manufacturers",
      role: "Turn raw goods into products and face uncertainty about input costs.",
    },
    { name: "Traders and shippers", role: "Move and store goods between producers and users." },
    {
      name: "Hedgers and speculators",
      role: "Hedgers manage a business price risk; speculators take positions on price moves.",
    },
    {
      name: "Exchanges and clearing corporations",
      role: "Provide rules and guarantee that exchange-traded trades are completed.",
    },
  ],
  misconceptions: [
    {
      claim: "A futures contract means I own the gold, cocoa or oil.",
      correction:
        "A futures contract is an agreement about a later date and price. Many are closed out before delivery and some settle in cash.",
      sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
    },
    {
      claim: "Spot and futures prices must always be the same.",
      correction:
        "They are different agreements and can differ because of timing, storage costs and expectations; they tend to converge near expiry.",
      sourceIds: [],
    },
    {
      claim: "A farmer who hedges always ends up better off.",
      correction:
        "Hedging reduces uncertainty by giving up some possible gain. If prices move favourably, the hedger may do worse than someone who did not hedge.",
      sourceIds: ["cftc-futures-basics"],
    },
    {
      claim: "Trading on an exchange makes futures safe.",
      correction:
        "A clearing corporation guarantees that trades are completed; it does not protect anyone from price losses, and losses can exceed the money first put in.",
      sourceIds: ["investor-gov-commodities", "cftc-futures-basics"],
    },
  ],
  glossaryTermIds: [
    "commodity",
    "spot-price",
    "futures-contract",
    "hedging",
    "settlement",
    "clearing-corporation",
    "supply-chain",
    "inventory",
    "leverage",
    "margin",
    "counterparty",
  ],
  quizIds: [
    "commodities-q1",
    "commodities-q2",
    "commodities-q3",
    "commodities-q4",
    "commodities-q5",
  ],
  readingSourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
  labId: "supply-shock",
};
