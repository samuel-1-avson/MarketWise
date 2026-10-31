import type { Slide } from "@/lib/schemas";

/**
 * The 24-slide deck (PRODUCT_AND_BUILD_SPEC.md §8). On-slide text is one short message; everything a
 * presenter needs to say lives in `notes`. Notes stay consistent with the lessons and only lean on
 * claims the cited sources support; numbers are fictional and labelled on the slides that show them.
 * Nothing here is advice, a signal, or a wagering instruction.
 */
export const slides: readonly Slide[] = [
  /* ===================================================== Hook and mental models */
  {
    id: "01-forex-sports-betting-suit",
    number: 1,
    chapter: "hook",
    title: "Is Forex Sports Betting in a Suit?",
    tagline: "Five systems. One question.",
    keyMessage:
      "Five systems get lumped together. They are not the same thing — but they do share uncertainty.",
    visual: "orbit-question",
    speakerCue: "Open with the misconception.",
    interactiveCue: "Audience show of hands: same, different, or not sure?",
    notes: {
      teachingPoint:
        "Name the claim people repeat — that forex is just betting dressed up — and promise to test it by comparing mechanisms rather than slogans.",
      explanation: [
        "Ask who has heard that forex is just gambling. Take a quick show of hands for same, different and not sure, and say every answer is a fair place to start.",
        "Say what you will earn by the end: they are different activities with different objects and different ways of settling, yet both involve uncertainty and both can be used in harmful ways.",
        "State plainly that this is education with fictional numbers, and that nothing tonight is advice or a tip.",
      ],
      analogy:
        "Five tools on a workshop bench can all hurt you if misused, but nobody confuses a saw with a spirit level.",
      misconception:
        "A screen full of charts must mean the same thing is happening. How something looks says nothing about what is being exchanged.",
      transition:
        "To compare fairly we need a promise about how we will compare, and that is slide two.",
      audienceQuestion: "Show of hands: same, different, or not sure?",
    },
    relatedRoute: "/compare",
    sourceIds: [],
  },
  {
    id: "02-tonights-promise",
    number: 2,
    chapter: "hook",
    title: "Tonight's Promise",
    tagline: "Mechanisms, not hype.",
    keyMessage:
      "For each system we ask the same four things: what changes hands, who takes part, how the price or outcome arises, and where the risk sits.",
    visual: "five-disciplines",
    speakerCue: "We compare mechanisms, not hype.",
    interactiveCue: "None — let the promise land.",
    notes: {
      teachingPoint:
        "Set the method: every system gets the same four questions, so differences show up fairly and nobody is sold anything.",
      explanation: [
        "Walk the five columns once: forex, stocks, commodities, crypto and sports betting. Say that wagering appears only so it can be told apart from financial markets and its risks discussed honestly.",
        "Read the four questions aloud: what changes hands, who takes part, how a price or outcome arises, where the risk sits.",
        "Make three promises: examples use invented numbers, no one will be told what to buy or do, and uncertainty will be named every time it matters.",
      ],
      analogy:
        "It is like a fair taste test: same spoon, same order, same questions for every dish.",
      misconception:
        "Comparing systems means ranking them. We are not asking which is best or safest, only how each one works.",
      transition: "Before any one system, we need the idea they all borrow: a market.",
    },
    sourceIds: [],
  },
  {
    id: "03-what-is-a-market",
    number: 3,
    chapter: "hook",
    title: "What Is a Market?",
    tagline: "Buyers, sellers, prices, information.",
    keyMessage:
      "A market is a way for buyers and sellers to find each other, agree a price and share information.",
    visual: "market-actors",
    speakerCue: "Markets match interests and carry information.",
    interactiveCue: "Point to each actor on the diagram and ask what they want.",
    notes: {
      teachingPoint:
        "A market is not a place or a screen; it is any arrangement where buyers and sellers can meet and a price emerges.",
      explanation: [
        "Draw the eye to the buyers on the left and the sellers on the right. Each has something they would pay or accept, and the meeting point is a price.",
        "Point out the second job: the price carries information back to everyone, telling producers and users how scarce something seems.",
        "Say that different systems arrange this meeting differently — on an exchange, through a dealer, on a network, or with an operator setting terms — and that difference is the whole lesson.",
      ],
      analogy:
        "A busy food market works the same way: stall holders and shoppers haggle, and the going price for tomatoes tells everyone what is plentiful.",
      misconception:
        "A price is a fact about the thing itself. It is really the current meeting point of many people's opinions and needs.",
      transition:
        "Now the word that every one of these systems shares, and treats very differently: risk.",
      audienceQuestion:
        "Where have you seen a price change because a lot of people wanted the same thing?",
    },
    sourceIds: [],
  },
  {
    id: "04-one-word-risk",
    number: 4,
    chapter: "hook",
    title: "One Word: Risk",
    tagline: "Same word. Very different things.",
    keyMessage:
      "Risk looks different in every system, but uncertainty is the common thread. Streaks happen by chance.",
    visual: "uncertainty-field",
    speakerCue: "Risk exists in very different systems.",
    interactiveCue: "Open the Uncertainty Tiles lab and reveal a few tiles together.",
    notes: {
      teachingPoint:
        "Uncertainty is the shared ingredient; what differs is where it comes from and who carries it.",
      explanation: [
        "Point at the field of circles and squares and say each shape is drawn at random from a fixed set. Ask the room to look for patterns, then show the longest streak.",
        "Explain that streaks of the same shape are normal in random draws and do not mean the next one is due to change.",
        "Make the bridge: in each system the uncertainty has a different source — a rate, a company, a harvest, a network, an event — and different protections or lack of them.",
      ],
      analogy:
        "Flip a coin sixty times and you will see runs that look meaningful. They are just what chance looks like.",
      misconception:
        "After a streak, the other result is due. For independent chance events there is no memory, so a streak changes nothing about the next draw.",
      transition: "Let us start with the system people ask about most: forex, in sixty seconds.",
      audienceQuestion:
        "Which would you expect to see in sixty random tiles: a run of two, or a run of five?",
    },
    labId: "uncertainty-tiles",
    sourceIds: [],
  },

  /* ============================================================== Forex */
  {
    id: "05-forex-in-60-seconds",
    number: 5,
    chapter: "forex",
    title: "Forex in 60 Seconds",
    tagline: "A price of one currency in another.",
    keyMessage:
      "An exchange rate is a price: how many units of one currency buy one unit of another.",
    visual: "currency-plates",
    speakerCue: "Exchange rates relate two currencies.",
    interactiveCue: "Open the FX Quote Explainer and flip the pair.",
    notes: {
      teachingPoint:
        "A rate is always a pair: the first currency is the base and the number says how many units of the second it is worth.",
      explanation: [
        "Read the plates left to right: in this invented example one US dollar is worth ten Ghana cedis. Say again that the number is fictional and not a live rate.",
        "Flip the pair in your head: one cedi is worth a tenth of a dollar. Same fact, read from the other side.",
        "Add that dealers quote a lower price they pay and a higher price they charge, and the gap, the spread, is a cost built in before any rate moves.",
      ],
      analogy:
        "A rate is like a price tag in a foreign shop: it only means something once you know which two currencies it connects.",
      misconception:
        "A rising number always means a stronger currency. It depends which currency is the base; the same move reads as rising from one side and falling from the other.",
      transition:
        "Rates matter long before anyone speculates, because real businesses face them every day.",
      audienceQuestion:
        "If the number goes from 10 to 11, who needs more cedis to pay the same dollar bill?",
    },
    labId: "fx-quote",
    sourceIds: ["moneysmart-forex"],
    sourceNote:
      "Reading a currency pair is from the ASIC Moneysmart page (Australia). How dealers quote a bid and an ask, and the invented 10.00 rate, are general explanation needing editorial verification.",
  },
  {
    id: "06-who-needs-forex",
    number: 6,
    chapter: "forex",
    title: "Who Needs Forex?",
    tagline: "Businesses face currency risk first.",
    keyMessage:
      "Real businesses face currency exposure before anyone speculates. A fictional importer shows why.",
    visual: "importer-bank-exporter",
    speakerCue: "Real businesses face currency exposure.",
    interactiveCue: "Walk through the fictional importer story step by step.",
    notes: {
      teachingPoint:
        "Currency exchange exists to pay across borders, and a changing rate is a business risk even for someone with no interest in speculation.",
      explanation: [
        "Tell the story with the diagram: an invented importer in Accra owes a supplier ten thousand US dollars in thirty days. At ten cedis per dollar the bill is a hundred thousand cedis.",
        "If the invented rate drifts to ten and a half, the same bill costs five thousand cedis more. The importer did nothing differently; the cost simply moved with the rate.",
        "Stress that the importer wants predictability, not profit, and that how a business manages this is a question for its bank or adviser, not something to recommend tonight.",
      ],
      analogy:
        "It is like agreeing to buy imported fabric priced in dollars: your budget in cedis is only as firm as the rate on the day you pay.",
      misconception:
        "Only traders care about exchange rates. Anyone invoiced in a foreign currency is exposed to them.",
      transition: "So what makes a rate move at all? That is the next slide.",
      audienceQuestion:
        "Who else might care about the rate: a family receiving money from abroad, a student paying fees overseas?",
    },
    relatedRoute: "/explore/forex",
    sourceIds: ["moneysmart-forex"],
    sourceNote:
      "The importer story is entirely invented. That a changing rate is a business risk is general explanation needing editorial verification; it is not drawn from a cited page.",
  },
  {
    id: "07-why-fx-rates-change",
    number: 7,
    chapter: "forex",
    title: "Why FX Rates Change",
    tagline: "Many pushes. No single dial.",
    keyMessage:
      "Interest rates, trade, growth and sentiment all push on a rate. No single factor sets tomorrow's price.",
    visual: "rate-drivers",
    speakerCue: "No single factor sets tomorrow's price.",
    interactiveCue:
      "Tap a driver card and say which direction it could push, and why it might not.",
    notes: {
      teachingPoint:
        "A rate reflects demand and supply for each currency, shaped by several forces that interact and change in importance.",
      explanation: [
        "Name the cards: interest rates and central-bank policy, inflation expectations, trade flows, economic growth and confidence, and news and sentiment.",
        "For each, give a direction it could push and then a reason it might not, so the audience feels the difficulty of forecasting.",
        "Close with Australia's consumer regulator's plain view: even the most experienced traders find movements hard to predict, and claims of reliable prediction deserve suspicion.",
      ],
      analogy:
        "It is like weather: you can describe what drove yesterday's changes afterwards and still be unsure about next Thursday.",
      misconception:
        "If you understand the drivers you can call the next move. Understanding explains the news; it does not remove uncertainty.",
      transition:
        "The next slide covers a risk both US and Australian regulators stress: what happens when exposure is magnified.",
      audienceQuestion: "Can you think of a headline that could push a rate two ways at once?",
    },
    sourceIds: ["moneysmart-forex"],
    sourceNote:
      "ASIC Moneysmart (Australia) supports: rates reflect demand and supply, move with interest rates and economic and trade conditions, and are hard to predict. Inflation expectations, central-bank policy and sentiment as drivers are general explanation needing editorial verification.",
  },
  {
    id: "08-fx-reality-check",
    number: 8,
    chapter: "forex",
    title: "FX Reality Check",
    tagline: "Leverage works in both directions.",
    keyMessage: "Leverage makes small moves matter more, in both directions. It is not free money.",
    visual: "leverage-bars",
    speakerCue: "Small movements can have big consequences.",
    interactiveCue: "Open the Leverage Sensitivity lab and move between none, some and more.",
    notes: {
      teachingPoint:
        "Leverage means exposure larger than the money put in, so the same price move is felt as a bigger change in your own money, up or down.",
      explanation: [
        "Compare the two bars: the same invented one percent move changes your own money by one percent with no leverage and by twenty percent in the toy model with more leverage.",
        "Say the toy multipliers are teaching values, not real product settings, and that no level is a safe or recommended one.",
        "Add what regulators warn about: a provider may demand more money at short notice or close a position, and with some products you can owe more than you put in. Costs also apply.",
      ],
      analogy:
        "A long lever moves a heavy rock more easily, but it also moves your hand further if the rock slips.",
      misconception:
        "Leverage is free money. It multiplies exposure, not skill, and costs and forced closure still apply.",
      transition:
        "Time to leave currencies and look at something very different: owning part of a company.",
      audienceQuestion:
        "If a move can use up all of the money put in, what does that say about the word 'small'?",
    },
    labId: "leverage-sensitivity",
    sourceIds: ["cftc-forex-advisory", "moneysmart-forex"],
  },

  /* ============================================================== Stocks */
  {
    id: "09-stocks-in-60-seconds",
    number: 9,
    chapter: "stocks",
    title: "Stocks in 60 Seconds",
    tagline: "A fraction of a business.",
    keyMessage:
      "A share is a fractional ownership interest in a company. It is not a guaranteed slice of profit.",
    visual: "company-shares",
    speakerCue: "A share is an ownership interest.",
    interactiveCue: "Open the Equity Ownership Lens and highlight a few shares.",
    notes: {
      teachingPoint:
        "A share is a unit of ownership in a company: a small real slice of a business, with no promise attached.",
      explanation: [
        "Use the mosaic: a fictional bakery split into a thousand equal shares. Highlight twenty-five and say that is two and a half percent of the whole.",
        "Explain why companies issue shares: to raise money, for example to pay off debt, launch products or expand.",
        "Be clear about what a share is not: not a loan, not a guaranteed dividend, and not a guaranteed gain. Prices move down as well as up, and common shareholders are paid last if a company fails.",
      ],
      analogy:
        "Owning a share is like owning one slice of a very large pie whose size nobody can fully predict.",
      misconception:
        "A share guarantees growth or a dividend. A dividend is the company's choice, and a price can fall as easily as rise.",
      transition:
        "If a share is a slice of an uncertain pie, what makes its price move day to day?",
      audienceQuestion: "If the bakery pays no dividend this year, what do you still own?",
    },
    labId: "ownership-lens",
    sourceIds: ["investor-gov-stocks"],
  },
  {
    id: "10-who-moves-stock-prices",
    number: 10,
    chapter: "stocks",
    title: "Who Moves Stock Prices?",
    tagline: "Expectations, not certainty.",
    keyMessage:
      "A share price is many people's changing opinions about a company's future, not a fixed fact.",
    visual: "price-drivers-mosaic",
    speakerCue: "Prices reflect changing assessments.",
    interactiveCue: "Pick a card and ask whether it is news about the company or about the world.",
    notes: {
      teachingPoint:
        "A price is where buyers and sellers currently meet, so it moves whenever their assessments change.",
      explanation: [
        "Go through the mosaic: earnings and what was expected, company news, interest rates and the wider economy, competition, and market mood.",
        "Separate two kinds of cause: things inside the company, such as a faulty product, and things it cannot control, such as political or market events.",
        "Remind the room that a price reflects expectations about the future, so good news can already be in the price.",
      ],
      analogy:
        "Think of a price as the average of a crowd's guesses about the future, which shifts as the crowd learns things.",
      misconception:
        "A price tells you exactly what a company is worth. Two honest investors can value the same company differently.",
      transition:
        "From ownership of a business to something you can hold in your hands: real goods.",
      audienceQuestion:
        "Is a surprise profit warning an inside-the-company or an outside-the-company cause?",
    },
    sourceIds: ["investor-gov-stocks"],
  },

  /* ========================================================== Commodities */
  {
    id: "11-commodities-in-real-life",
    number: 11,
    chapter: "commodities",
    title: "Commodities in Real Life",
    tagline: "Goods that have to be grown, dug up and shipped.",
    keyMessage:
      "Commodities are real goods with real supply chains. Futures are contracts about them, not the goods themselves.",
    visual: "supply-chain",
    speakerCue: "Physical goods have real-world demand.",
    interactiveCue: "Trace one good, such as cocoa, from farm to finished product.",
    notes: {
      teachingPoint:
        "Commodities are interchangeable goods such as cocoa, gold, oil or wheat, and each passes through a physical chain before anyone uses it.",
      explanation: [
        "Follow the chain on the diagram: growing or mining, processing, shipping and storage, then a manufacturer. Disruption at any link can change availability further along.",
        "Introduce the two worlds: real goods that change hands for delivery now, and contracts whose value follows the price of those goods.",
        "Keep the stories fictional and general; do not claim anything about how any real country sells its crops or minerals.",
      ],
      analogy: "It is a relay race: if one runner stumbles, everyone downstream runs late.",
      misconception:
        "A contract on cocoa is a bag of cocoa. A contract is an agreement about a price and a date.",
      transition: "That difference between the goods and the contract is the next slide.",
      audienceQuestion: "Which link in the chain do you think is easiest to disrupt?",
    },
    sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
    sourceNote:
      "The CFTC and SEC pages (United States) cover futures only. The physical supply chain and spot prices are general explanation needing editorial verification.",
  },
  {
    id: "12-spot-is-not-futures",
    number: 12,
    chapter: "commodities",
    title: "Spot Is Not Futures",
    tagline: "Different instruments, different obligations.",
    keyMessage:
      "Spot is for delivery now or very soon. A futures contract fixes a price today for a date in the future.",
    visual: "spot-vs-futures",
    speakerCue: "Different instruments, different obligations.",
    interactiveCue: "Point to the two timelines and ask which one has a future date on it.",
    notes: {
      teachingPoint:
        "A spot price is for delivery now; a futures contract is a standardised agreement about a later date with price and quantity fixed today.",
      explanation: [
        "On the top timeline, goods and money change hands now. On the bottom, only an agreement is made now, and the exchange happens, or is settled in cash, later.",
        "Say that many futures contracts are closed out before any delivery and some settle in cash, so holding one is not owning the goods.",
        "Note that on an exchange a clearing corporation acts as counterparty to every trade and guarantees completion; that does not protect anyone from price losses.",
      ],
      analogy:
        "Spot is buying fruit from the stall today. A futures contract is a standardised agreement about price and date, and most are closed out before any fruit changes hands.",
      misconception:
        "Spot and futures prices must always match. They are different agreements and can differ.",
      transition: "What happens to prices when the supply of a real good suddenly tightens?",
      audienceQuestion:
        "Who might want to fix a price months ahead: a producer, a manufacturer, or both?",
    },
    sourceIds: ["cftc-futures-basics", "investor-gov-commodities"],
    sourceNote:
      "Futures terms (set price and date, closed out or cash-settled, clearing corporation as counterparty) are from the CFTC and SEC pages (United States). What spot means is general explanation needing editorial verification.",
  },
  {
    id: "13-when-supply-changes",
    number: 13,
    chapter: "commodities",
    title: "When Supply Changes",
    tagline: "A teaching model, not a forecast.",
    keyMessage:
      "In a simple model, tighter supply pushes price pressure upward. It is a stylised diagram, not a forecast.",
    visual: "supply-curve",
    speakerCue: "Scarcity may change price incentives.",
    interactiveCue: "Open the Commodity Supply Story and toggle a fictional drought.",
    notes: {
      teachingPoint:
        "In a simple supply and demand picture, if supply shifts left while demand stays put, the meeting point moves to a higher price and a lower quantity.",
      explanation: [
        "Show the dashed normal-season supply line, then the shifted line, and the meeting point moving up and to the left.",
        "Name the invented shocks: a drought that hurts the harvest, or a transport delay. Say they are fictional and the diagram has no numbers on purpose.",
        "Stress the limits: real prices also respond to inventories, demand, costs and expectations, and no one can reliably predict them. The picture explains direction of pressure, nothing more.",
      ],
      analogy:
        "If fewer umbrellas arrive before a rainy season, shoppers compete for those that remain.",
      misconception:
        "The model tells us what the price will be. It shows only the direction of pressure under invented conditions.",
      transition: "Now a very different kind of system: one that lives on a shared digital record.",
      audienceQuestion: "What else besides supply could move the meeting point?",
    },
    labId: "supply-shock",
    sourceIds: [],
  },

  /* ============================================================== Crypto */
  {
    id: "14-crypto-more-than-a-chart",
    number: 14,
    chapter: "crypto",
    title: "Crypto: More Than a Chart",
    tagline: "Shared records, many designs.",
    keyMessage: "Crypto assets are entries on shared ledgers. Networks and tokens differ widely.",
    visual: "ledger-network",
    speakerCue: "Networks and tokens are not all alike.",
    interactiveCue: "Open the Ledger Journey and step through a valid and a rejected request.",
    notes: {
      teachingPoint:
        "A crypto asset is a digital representation of value recorded on a shared, cryptographically secured ledger; what it represents depends on its design.",
      explanation: [
        "Show the ring of computers each keeping a copy of the ledger, and the blocks of entries. A request is checked against the rules before it is added.",
        "Say that blockchain is one ledger design, not the only one, and that many tokens carry no ownership of a business or claim on profits.",
        "Keep it conceptual: this is not a how-to and involves no wallets, keys or real transfers on screen.",
      ],
      analogy:
        "Imagine a village notebook copied by many neighbours; an entry only counts when they all agree it follows the village rules.",
      misconception:
        "Crypto, blockchain and Bitcoin mean the same thing, and every token is a share in something. Neither is true.",
      transition: "A shared record is clever, but price is only one way things go wrong.",
      audienceQuestion: "What could go wrong if only one person kept the notebook?",
    },
    labId: "ledger-journey",
    sourceIds: ["investor-gov-crypto-related"],
    sourceNote:
      "The definition of a crypto asset on a distributed ledger is the SEC's (United States). That blockchain is one ledger design among others, and that many tokens carry no ownership of a business, are general explanation needing editorial verification.",
  },
  {
    id: "15-cryptos-special-risks",
    number: 15,
    chapter: "crypto",
    title: "Crypto's Special Risks",
    tagline: "Price is only one kind of risk.",
    keyMessage: "Price is only one risk. Custody, protocols and platform protections also matter.",
    visual: "crypto-risks",
    speakerCue: "Price is only one type of risk.",
    interactiveCue: "Tap each risk card and ask who is responsible if it goes wrong.",
    notes: {
      teachingPoint:
        "Crypto assets can be volatile and lose money, and they add risks of custody, software and platforms that other systems handle differently.",
      explanation: [
        "Cover three cards: volatility, custody, and protocol or platform risk. With self-custody you alone are responsible for the keys; with a provider you rely on that provider.",
        "Quote the US SEC's caution that platforms for crypto asset securities may lack important investor protections, and that a so-called proof of reserves is a limited snapshot, not an audit.",
        "Add that on many public networks a mistaken or fraudulent transfer is hard to reverse, and that scams are a constant risk.",
      ],
      analogy:
        "Holding your own keys is like carrying cash in your pocket: no bank to blame, and nobody to call if it is gone.",
      misconception:
        "If a well-known platform holds it, it is protected. Platforms differ and may lack protections you assume.",
      transition:
        "We have toured four financial systems. Now the one that creates no ownership at all: wagering.",
      audienceQuestion:
        "Which is harder to undo: a card payment or a transfer on a public network?",
    },
    sourceIds: ["investor-gov-crypto-related", "investor-gov-crypto-securities-alert"],
    sourceNote:
      "Volatility, wallets and keys, self-custody versus a provider, platform protections and proof of reserves are from the two SEC pages (United States; the alert is dated March 2023 and concerns crypto asset securities). That transfers are hard to reverse and that scams are a constant risk are general explanation needing editorial verification.",
  },

  /* ============================================================ Sports comparison */
  {
    id: "16-sports-betting-what-it-is",
    number: 16,
    chapter: "comparison",
    title: "Sports Betting: What It Is",
    tagline: "An agreement about an outcome.",
    keyMessage:
      "A wager is an agreement about an outcome, settled under an operator's rules. It gives no ownership of anything.",
    visual: "outcome-branch",
    speakerCue: "Wagers settle under operator rules.",
    interactiveCue: "No betting tools. Describe the diagram and discuss only.",
    relatedRoute: "/explore/sports-betting",
    notes: {
      teachingPoint:
        "A wager is an agreement made before an event, settled afterwards under written rules; it creates no ownership of a company, currency or commodity.",
      explanation: [
        "Walk the branching diagram: an event with defined possible outcomes, an agreement set by an operator, a result, and settlement. Afterwards the agreement is over.",
        "Say clearly that this slide is here only to tell wagering apart from financial markets, and that there will be no odds, no examples of wagers and no tips.",
        "Name the harm: an English evidence review groups gambling-related harms into financial, relationship, health and other types, and notes they can reach families. If anyone is worried about gambling in their own life or a friend's, suggest talking to someone they trust or a qualified local support service; name no services here.",
      ],
      analogy:
        "A share is a seat at the table that stays yours. A wager is a one-night agreement that ends when the result is read out.",
      misconception:
        "Betting is just another way of investing. It creates no ownership, and the operator is a commercial party with its own interests.",
      transition:
        "With the object clear, the next slide lines it up against the other objects we have met.",
    },
    sourceIds: ["phe-gambling-harms-review"],
    sourceNote:
      "Harm types are from the English evidence review (England; updated 2023), which also notes most studies cannot show that gambling came before the harm. That a wager creates no ownership stake is general explanation needing editorial verification.",
  },
  {
    id: "17-why-it-is-different",
    number: 17,
    chapter: "comparison",
    title: "Why It Is Different",
    tagline: "Four different objects.",
    keyMessage:
      "A wager, a share, a currency exchange and a futures contract are different objects with different obligations.",
    visual: "four-objects",
    speakerCue: "Different economic objects with different obligations.",
    interactiveCue: "Open the comparison and pick one question to compare across all five.",
    notes: {
      teachingPoint:
        "What you hold afterwards is the cleanest way to tell the systems apart: a stake in a business, a currency or a contract about a rate, a contract about goods, a token, or nothing you own.",
      explanation: [
        "Read the four cards: a share is a continuing ownership interest; a currency exchange delivers money, while retail margin forex is generally a contract with a dealer; a futures contract is an agreement about a later date; a wager is an agreement that ends at settlement.",
        "Open the comparison page and pick one question, such as what you hold afterwards, to see all five systems answer side by side.",
        "Repeat that comparing mechanisms is not ranking them; none of these is presented as safer or better.",
      ],
      analogy:
        "Compare a house, a rental agreement, a concert ticket and a wager: all involve money, but you hold very different things afterwards.",
      misconception:
        "If two things involve money and uncertainty, they are the same kind of thing. They are not.",
      transition:
        "If the objects differ so much, why do people still mix them up? The next slide answers that.",
      audienceQuestion: "Which of these four leaves you owning something once it is settled?",
    },
    relatedRoute: "/compare",
    sourceIds: ["investor-gov-stocks", "moneysmart-forex", "cftc-futures-basics"],
  },
  {
    id: "18-where-people-get-confused",
    number: 18,
    chapter: "comparison",
    title: "Where People Get Confused",
    tagline: "Purpose differs. Behaviour can look alike.",
    keyMessage:
      "Purpose differs, but behaviour can look alike. Chasing losses and trusting hype can appear anywhere.",
    visual: "speculation-spectrum",
    speakerCue: "Behaviour may look similar despite differences.",
    interactiveCue: "Open the myths page and reveal one claim together.",
    notes: {
      teachingPoint:
        "Systems differ in purpose and structure, yet harmful behaviour such as chasing losses or believing hype can show up in any of them.",
      explanation: [
        "Walk the spectrum from needing something, such as paying an invoice or hedging a crop, to purely speculating. Say each system sits at several points, depending on who is using it and why.",
        "Make the honest point that speculative trading and gambling are different structures, but a person can behave in similarly risky ways in both.",
        "Flag that this comparison is the site's own explanation, not a finding of the sources, and invite the room to look for the same warning signs everywhere: pressure, guarantees, secrecy.",
      ],
      analogy:
        "A knife is a tool in a kitchen and a hazard in a quarrel. The object is the same; the use is what changes.",
      misconception:
        "A genuine market purpose makes speculating in it safe. Purpose and risk are separate questions.",
      transition:
        "One claim deserves its own slide, because it shows up in every system: that research guarantees profit.",
      audienceQuestion: "What warning signs would you look for in any pitch, whatever the product?",
    },
    relatedRoute: "/myths",
    sourceIds: [],
    sourceNote:
      "This slide is the site's own simplified framing, not a finding of any cited source. The ranges are qualitative and illustrative.",
  },

  /* ====================================================== Myths and synthesis */
  {
    id: "19-myth-research-guarantees-profit",
    number: 19,
    chapter: "synthesis",
    title: "Myth: “Research Guarantees Profit”",
    tagline: "Claims worth crossing out.",
    keyMessage:
      "Research improves understanding. It never removes uncertainty, and nobody can promise returns.",
    visual: "redacted-claims",
    speakerCue: "Research never eliminates uncertainty.",
    interactiveCue: "Reveal myths on the myths page, one at a time.",
    notes: {
      teachingPoint:
        "Research makes you better informed, but information does not remove uncertainty, and any promise of guaranteed results is a warning sign.",
      explanation: [
        "On the slide, typical hype lines are struck through. Read the shape of each claim rather than the words: a guarantee, a secret method, urgency.",
        "Quote Australia's consumer regulator's wariness about any course, signal service, copy-trading service, program or AI tool that claims to predict currency movements accurately.",
        "Give the five questions to ask of any claim: what is the object, who benefits if you take part, where is the evidence, what is guaranteed, and what if it is wrong?",
      ],
      analogy:
        "Studying for an exam raises your chances; it does not turn the exam into a certainty.",
      misconception:
        "With enough research, profit is guaranteed. Understanding and certainty are different things.",
      transition: "Even without hype, there are costs that apply whichever way the price moves.",
      audienceQuestion: "Which of the five questions would catch the most claims you have seen?",
    },
    relatedRoute: "/myths",
    sourceIds: ["moneysmart-forex"],
  },
  {
    id: "20-hidden-frictions",
    number: 20,
    chapter: "synthesis",
    title: "Hidden Frictions",
    tagline: "Costs that ignore direction.",
    keyMessage: "Spreads, fees, custody and margin costs apply before any price moves your way.",
    visual: "friction-cards",
    speakerCue: "Frictions matter beyond price direction.",
    interactiveCue: "Pick a card and ask which systems it applies to.",
    notes: {
      teachingPoint:
        "Price direction is only part of the story; spreads, commissions, financing, storage and custody costs apply regardless of which way the price goes.",
      explanation: [
        "Cover four cards: spreads and commissions, financing and margin costs, storage and transport for physical goods, and custody or network costs for digital assets.",
        "Remind the room that spreads, commissions and financing costs add up, particularly with frequent trading. Physical goods add storage and transport, and digital assets add network and custody costs.",
        "Land the point that a cost is certain while a gain is not.",
      ],
      analogy:
        "A toll road charges you whether you arrive early or late; the toll is certain, the time saved is not.",
      misconception:
        "If the price goes my way I always come out ahead. Costs can turn a small gain into a loss.",
      transition: "Now we can put every system's risks side by side.",
      audienceQuestion: "Which cost surprises people most when they first notice it?",
    },
    relatedRoute: "/glossary",
    sourceIds: ["moneysmart-forex"],
    sourceNote:
      "Spreads, commissions, financing costs and the effect of frequent trading are from ASIC Moneysmart (Australia). Storage, transport and network costs are general explanation needing editorial verification.",
  },
  {
    id: "21-different-risks-no-easy-money",
    number: 21,
    chapter: "synthesis",
    title: "Different Risks, No Easy Money",
    tagline: "Five columns. Five kinds of exposure.",
    keyMessage: "Each system carries its own risks. A real purpose never removes them.",
    visual: "risk-columns",
    speakerCue: "Every category demands scepticism.",
    interactiveCue: "Open the comparison and read the caveat row aloud.",
    notes: {
      teachingPoint:
        "Every system has a distinct main risk, and none of them is a reliable way to make money.",
      explanation: [
        "Read down the five columns: forex, leverage and costs; stocks, price falls and loss of all the money put in; commodities, supply shocks and futures obligations; crypto, volatility and custody; wagering, financial and personal harm.",
        "Point out that in every column the risk is named in plain words rather than hidden in small print.",
        "End with the caveat row from the comparison page and say once more that nothing here is ranking safety.",
      ],
      analogy:
        "Five different roads each have their own hazards; a sign that says 'safe road' is the one to doubt.",
      misconception:
        "A regulated or purposeful market is a profit machine. Purpose does not remove price, fee, leverage, fraud or behavioural risk.",
      transition: "Before we wrap up, a quick check of understanding: three questions from you.",
    },
    relatedRoute: "/compare",
    sourceIds: [
      "investor-gov-stocks",
      "moneysmart-forex",
      "cftc-futures-basics",
      "investor-gov-crypto-related",
      "investor-gov-crypto-securities-alert",
      "phe-gambling-harms-review",
    ],
    sourceNote:
      "Each column rests on the sources listed (United States, Australia, England). Scams around crypto are general explanation needing editorial verification. The comparison compares risks; it does not rank them.",
  },
  {
    id: "22-test-your-understanding",
    number: 22,
    chapter: "synthesis",
    title: "Test Your Understanding",
    tagline: "Understanding, not predictions.",
    keyMessage:
      "Three questions to check what stuck. The answers come with explanations, never prizes.",
    visual: "audience-questions",
    speakerCue: "We want understanding, not predictions.",
    interactiveCue: "Run three questions with the room, then open the quiz page.",
    notes: {
      teachingPoint:
        "A short check turns the evening from listening into thinking, and every answer carries a factual correction.",
      explanation: [
        "Read each question and give the room a few seconds. Take a show of hands for A, B or C, then give the explanation whichever option won.",
        "Keep tone light: there are no prizes, no scores to announce and nobody is put on the spot.",
        "Point to the quiz page for anyone who wants to try the full set of questions at their own pace, with an optional saved record that stays in their own browser.",
      ],
      analogy: "It is a friendly pop quiz where the point is the explanation, not the mark.",
      misconception:
        "Quizzes are about winning. This one is about spotting where an idea is still fuzzy.",
      transition: "Last, the five ideas worth taking home.",
      audienceQuestion: "Which question would you like to hear explained again?",
    },
    relatedRoute: "/quiz",
    sourceIds: [],
  },
  {
    id: "23-five-takeaways",
    number: 23,
    chapter: "synthesis",
    title: "Five Takeaways",
    tagline: "Mechanism first. Risks always.",
    keyMessage:
      "Mechanism first. Risks always. Costs count. Claims need evidence. Uncertainty never disappears.",
    visual: "five-takeaways",
    speakerCue: "Mechanism first; risks always.",
    interactiveCue: "Ask the room to say each takeaway back in their own words.",
    notes: {
      teachingPoint:
        "Five ideas travel to any system: work out what is being exchanged, name the risks, count the costs, ask for evidence, and remember uncertainty stays.",
      explanation: [
        "Read the five lines slowly, connecting each to its slide: mechanism first from the comparison, risks always from 'Different Risks, No Easy Money', costs count from 'Hidden Frictions', claims need evidence from the myth slide.",
        "Say the last one twice: uncertainty never disappears, however much you know.",
        "Invite the room to add a sixth, then repeat that nothing tonight was advice and every number was invented.",
      ],
      analogy:
        "These five are like a pocket checklist for any pitch you meet, whether it arrives in a text or a talk.",
      misconception:
        "Learning how a market works makes it safe to try. Knowledge helps you judge claims; it does not guarantee outcomes.",
      transition: "Finally, where to keep learning at your own pace.",
      audienceQuestion: "What is the one takeaway you would pass on to a friend?",
    },
    sourceIds: [],
  },
  {
    id: "24-keep-learning",
    number: 24,
    chapter: "synthesis",
    title: "Keep Learning",
    tagline: "At your own pace.",
    keyMessage:
      "Continue at your own pace. Everything here is education, with fictional numbers, and not advice.",
    visual: "keep-learning",
    speakerCue: "Continue learning at your own pace.",
    interactiveCue: "Open the resources page and show where sources and limits are listed.",
    notes: {
      teachingPoint:
        "The lessons, labs, glossary and sources are there for self-paced learning, and the limits of the material are stated openly.",
      explanation: [
        "Point to the explore page, then the resources page, where each source shows who published it, what it is used for and which country it speaks about.",
        "Repeat the disclaimer: for learning only, fictional numbers, no financial advice, no trading signals, no wagering instructions and no live data.",
        "Mention that there are no accounts or tracking, and that optional quiz progress stays in each person's own browser. Say you will share the real address once the site has been approved for publishing.",
      ],
      analogy:
        "Think of it as a library card, not a trading licence: it gets you to the books, and the reading is yours.",
      misconception:
        "A site that explains markets is recommending them. This one explains, and recommends nothing.",
      transition: "Thank the room, take questions, and keep the handout open as a backup.",
      audienceQuestion: "What topic should we go deeper on next time?",
    },
    relatedRoute: "/resources",
    sourceIds: [],
  },
];

export const slideById: ReadonlyMap<string, Slide> = new Map(slides.map((s) => [s.id, s] as const));
