import type { Lesson } from "@/lib/schemas";
import { REVIEWED, section } from "./helpers";

export const crypto: Lesson = {
  id: "crypto",
  title: "Crypto: shared ledgers, tokens and keys",
  kicker: "Networks and digital records",
  summary:
    "Crypto assets are entries on shared digital ledgers. They differ widely in what they represent, and their risks include volatility, custody mistakes and scams.",
  snapshot: {
    changesHands: "Tokens: entries on a shared ledger, controlled through keys.",
    purpose: "Varies by network: records, transfers and applications; many are traded as assets.",
    mainRisk: "Volatility, lost or stolen keys, scams and platforms that may lack protections.",
  },
  lastReviewed: REVIEWED,
  reviewNote:
    "The definition of a crypto asset, the volatility and risk of loss, wallets and private keys, self-custody versus third-party custody, the distinction between owning crypto and owning shares of a crypto-related company, and the cautions about platforms, unregistered offerings and proof of reserves are drawn from two SEC Investor.gov pages (United States sources, one dated March 2023). The conceptual walk-through of how entries are proposed, validated and recorded, the distinction between blockchains and other ledger designs, and the fictional narrative are general explanation flagged for editorial verification, as are statements that transfers are generally hard or impossible to reverse, that regulatory treatment differs by place, that many tokens exist mainly to be traded, and that trading on some venues runs around the clock. The platform cautions come from an SEC alert about crypto asset securities specifically and are scoped that way. This lesson is conceptual only: it contains no addresses, wallet instructions or transfer steps, and says nothing about the law in Ghana.",
  sections: [
    section(
      "headline",
      "Crypto, in plain words",
      [
        "Crypto is shorthand for a family of technologies that keep shared records on many computers at once, with rules that let strangers agree on what the record says without a single organisation in charge of it. The things recorded are called tokens or crypto assets.",
        'The SEC\'s investor-education page defines a crypto asset as any digital representation of value that is recorded on a cryptographically secured distributed ledger. Notice how broad that is: it does not say the thing is a currency, a company share, or backed by anything. What a given token represents depends on its design — which is exactly why "crypto" cannot be treated as one thing.',
      ],
      { sourceIds: ["investor-gov-crypto-related"] },
    ),
    section(
      "object",
      "What actually changes hands?",
      [
        'When a token "moves", nothing physical travels. The shared ledger is updated so that the entry is now controlled by someone else. Control follows secret keys: the person who holds the right key can authorise changes to entries they control.',
        "What that entry means in the real world differs. Some tokens are designed mainly to be held and traded; some give access to a service; many carry no ownership of a business and no claim on anyone's cash flows. Shares of a listed company that works in the crypto industry are a different matter altogether: the SEC points out that holders of such shares do not directly own any crypto assets, and that the shares may trade higher or lower independent of any crypto price.",
      ],
      {
        callout: {
          label: "A token is not automatically a share",
          text: "Do not assume a token gives ownership of a company, a claim on profits, or any legal protection. Check what it actually represents, and be cautious if no one can tell you.",
        },
        sourceIds: ["investor-gov-crypto-related"],
      },
    ),
    section(
      "purpose",
      "Why do these networks exist?",
      [
        "The original idea was to keep a trustworthy shared record without relying on one central organisation. Different networks build different things on that idea: ways to move value, applications that run automatically on the ledger, and systems for recording who controls what.",
        "Not all of this is aimed at the general public, and many tokens exist mainly to be traded. The SEC describes the universe of crypto asset-related investments as broad and growing, offering both opportunities and risks. Purpose therefore varies network by network, and it should be checked rather than assumed.",
      ],
      { sourceIds: ["investor-gov-crypto-related"] },
    ),
    section(
      "participants",
      "Who takes part, and why?",
      [
        "Many different roles overlap in crypto, and one party can play several. Knowing who holds your keys, and who runs the platform you use, matters more here than in most systems.",
      ],
      {
        points: [
          "Users hold and move tokens, or use applications built on a network.",
          "Network participants run the computers that check and record entries, following the network's rules.",
          "Developers write and update the software that defines the rules.",
          "Exchanges and platforms let people buy, sell, borrow or lend tokens; they may also hold tokens on customers' behalf.",
          "Custodians hold keys for others, where a user chooses third-party custody.",
          "Speculators trade tokens hoping to profit from price changes.",
        ],
        sourceIds: ["investor-gov-crypto-related", "investor-gov-crypto-securities-alert"],
      },
    ),
    section(
      "mechanism",
      "How entries are recorded — and how prices arise",
      [
        'Two different things are called "how it works", and it helps to separate them. The first is how the network agrees on its record. A user authorises a change using a secret key; the request is sent to many computers; those participants check it against the network\'s rules (is the user authorised, has the value already been used?); and valid entries are added to a ledger that all copies keep in step. The method of agreeing is called consensus, and different networks use different methods. Some group entries into linked blocks — a blockchain — but not every network is built that way.',
        "The second is how a token gets a price. That is set where it is traded: buyers and sellers on exchanges and other venues, in the same supply-and-demand way as other markets. Trading on some venues runs around the clock, though that is not universal, and trading in derivatives on tokens differs from holding tokens themselves.",
        "The Ledger Journey lab steps through the first of these using a toy transaction. It has no wallets, keys, addresses or real transfers.",
      ],
      { sourceIds: ["investor-gov-crypto-related"] },
    ),
    section(
      "influences",
      "What influences prices?",
      [
        "No single force explains token prices, and many tokens have no cash flows to anchor a valuation, so sentiment can matter a great deal. The SEC warns that these investments can be volatile and can lose money.",
      ],
      {
        points: [
          "Adoption and use: whether people actually use a network or application.",
          "Technology changes and security incidents.",
          "Regulation and legal developments, which differ by place and change.",
          "Market structure: how easy it is to buy and sell without moving the price.",
          "Sentiment, news and social media, which can drive swift swings.",
          "Design features, such as how many tokens can exist and when they are released.",
        ],
        sourceIds: ["investor-gov-crypto-related", "investor-gov-crypto-securities-alert"],
      },
    ),
    section("narrative", "A fictional network", [
      "Picture a small fictional network called Lantern. Ama wants to transfer a record of value to Kofi. In Lantern's rules, nothing happens until the owner of the entry authorises it with a secret that only she should hold; this proves the request is hers without giving the secret to anyone.",
      "The request is sent out to the computers that keep Lantern's ledger. Each checks the rules: is the authorisation valid, and does the entry really belong to Ama? When they agree it is valid, it is added to the shared record and every copy updates. Kofi's entry now shows the new control.",
      "Now think about what could go wrong. If Ama loses the secret, then in plain self-custody there may be no one who can restore her access. If someone steals it, they can authorise changes as if they were her. If she hands her entries to a platform to look after, she relies on that platform's honesty and solvency. The story shows the idea, not a procedure: nothing here is guidance for sending anything to anyone.",
    ]),
    section("misconceptions", "Common misconceptions", [
      "Crypto attracts oversimplified claims from both enthusiasts and critics. Here are the ones that matter most for understanding the mechanism.",
    ]),
    section(
      "risks",
      "Risks and failure modes",
      [
        "The SEC states that the risk of loss for individual investors in transactions involving crypto assets remains significant, and that the only money to put at risk in a speculative investment is money you can afford to lose entirely.",
      ],
      {
        points: [
          "Volatility: prices can swing sharply and holdings can lose much of their value.",
          "Custody: with self-custody you alone are responsible for the keys; with third-party custody you rely on a provider that could fail, be hacked or mismanage assets.",
          "Irreversibility: a mistaken or fraudulent transfer is generally hard or impossible to undo.",
          "Scams and fraud: fake platforms, impersonation and promises of easy profits.",
          "Platform protections: the SEC warns that platforms where crypto asset securities are bought, sold, borrowed or lent may lack important investor protections, and that some offering crypto asset investments or services may not be complying with applicable law.",
          'Weak assurances: a "proof of reserves" may give only a snapshot and is not as rigorous as an audit.',
          "Code and protocol risk: errors in smart contracts or network software can cause losses.",
          "Rules differ by country and are changing; a service available to you may carry fewer protections than you assume.",
        ],
        sourceIds: ["investor-gov-crypto-related", "investor-gov-crypto-securities-alert"],
      },
    ),
    section("check", "Check your understanding", [
      "Five short questions with explanations after every answer. Retry as often as you like.",
    ]),
    section(
      "summary",
      "Summary and further reading",
      [
        "Crypto assets are entries on shared ledgers, controlled through keys, and they differ widely in what they represent. Prices are set by trading, not by the network's rules, and the main risks are volatility, custody, scams and weak protections.",
      ],
      {
        points: [
          "A crypto asset is a digital representation of value on a distributed ledger; its meaning depends on its design.",
          "Many tokens carry no ownership of a business or claim on profits.",
          "Whoever controls the keys controls the asset, so custody decisions matter.",
          "Owning shares of a crypto-related company is not owning crypto.",
        ],
      },
    ),
  ],
  actors: [
    { name: "Users", role: "Hold and move tokens or use applications built on a network." },
    {
      name: "Network participants",
      role: "Run computers that check entries against the rules and keep the ledger in step.",
    },
    {
      name: "Exchanges and platforms",
      role: "Let people buy, sell, borrow or lend tokens, and sometimes hold them for customers.",
    },
    { name: "Custodians", role: "Hold keys on behalf of users who choose third-party custody." },
    { name: "Developers", role: "Write the software that defines a network's rules." },
  ],
  misconceptions: [
    {
      claim: "Crypto, blockchain and Bitcoin all mean the same thing.",
      correction:
        "A crypto asset is any digital representation of value on a distributed ledger. Blockchain is one ledger design, and networks differ in how they work.",
      sourceIds: ["investor-gov-crypto-related"],
    },
    {
      claim: "Every token is a share in some business.",
      correction:
        "Many tokens carry no ownership of a business or claim on profits. What a token represents depends on its design, and some may be treated as securities in some places.",
      sourceIds: ["investor-gov-crypto-related", "investor-gov-crypto-securities-alert"],
    },
    {
      claim: "If a well-known platform holds my crypto, it is protected.",
      correction:
        "Platforms may lack important investor protections, and third-party custody means relying on the provider. A proof of reserves is not the same as an audit.",
      sourceIds: ["investor-gov-crypto-securities-alert", "investor-gov-crypto-related"],
    },
    {
      claim: "Owning shares of a crypto company is the same as owning crypto.",
      correction:
        "You would own part of the company, not the tokens, and its share price can move independently of any crypto price.",
      sourceIds: ["investor-gov-crypto-related"],
    },
    {
      claim: '"Decentralised" means no one can lose money or be scammed.',
      correction:
        "Decentralised design does not remove price risk, key loss, fraud or software errors; it can move responsibility onto the user.",
      sourceIds: ["investor-gov-crypto-related"],
    },
  ],
  glossaryTermIds: [
    "crypto-asset",
    "distributed-ledger",
    "blockchain",
    "token",
    "private-key",
    "wallet",
    "self-custody",
    "custody",
    "consensus",
    "validation",
    "smart-contract",
  ],
  quizIds: ["crypto-q1", "crypto-q2", "crypto-q3", "crypto-q4", "crypto-q5"],
  readingSourceIds: ["investor-gov-crypto-related", "investor-gov-crypto-securities-alert"],
  labId: "ledger-journey",
};
