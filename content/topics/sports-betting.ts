import type { Lesson } from "@/lib/schemas";
import { REVIEWED, section } from "./helpers";

/**
 * Critical-literacy lesson only. It must never contain operator names, links to gambling services,
 * odds, payout formulae, sample wagers, strategies or tips (CLAUDE.md, EDITORIAL_ACCURACY_GUIDE.md).
 */
export const sportsBetting: Lesson = {
  id: "sports-betting",
  title: "Sports betting: a wager is not an asset",
  kicker: "A critical-literacy comparison",
  summary:
    "A wager is an agreement about the outcome of an event, settled under an operator's rules. This lesson exists to tell it apart from financial markets and to be honest about the harm gambling can cause.",
  snapshot: {
    changesHands: "No ownership stake in anything: an agreement settled by an operator's rules.",
    purpose:
      "A commercial service built on outcome uncertainty — not ownership or capital formation.",
    mainRisk: "Financial loss and documented harms to health, relationships and families.",
  },
  lastReviewed: REVIEWED,
  reviewNote:
    "Only one gambling-related source has been read and verified: an English evidence review on gambling-related harms (England; updated January 2023), which supports the harm categories, the reach of harms to families and close associates, the greater risk to some groups, and the limits of the evidence. A WHO fact sheet was not cited because its page did not load in the review environment. Everything else here is general conceptual explanation flagged for editorial verification: that a wager creates no ownership stake in an asset, that an operator's terms are designed so it is expected to earn revenue, that operators take widely known information into account, and that streaks occur by chance in independent random events. This lesson contains no operator names, links to gambling services, odds, payout formulae, sample wagers or strategies, and it makes no statement about gambling law or regulation in Ghana or anywhere else.",
  sections: [
    section("headline", "Sports betting, in plain words", [
      "Sports betting means committing money on the outcome of a defined sporting event, under the written rules of a business that offers the arrangement. If the outcome happens as specified, the business pays an agreed amount; if not, the money is lost.",
      "This lesson is on the site for one reason: so that wagering can be told apart from the financial systems it is often compared with, and so that its risks are discussed honestly. It will not help anyone place a wager, compare operators, interpret terms or choose outcomes — and nothing on this site ever will.",
    ]),
    section(
      "object",
      "What actually changes hands?",
      [
        "A wager is an agreement. Money is committed before the event, an outcome is defined, and when the event is over the arrangement is settled under the operator's rules. At no point does the person making the wager acquire a share of a company, a quantity of currency, a commodity or a claim on any asset.",
        "That is the sharpest difference from the other four systems. A share keeps representing a fraction of a business long after you buy it. A currency or a bag of cocoa exists and can be used. A wager ends at settlement; afterwards there is nothing left to hold.",
      ],
      {
        callout: {
          label: "A wager is not an investment",
          text: 'Calling a wager an "investment" does not give it an underlying asset, a business that can grow, or a use beyond the outcome of the event.',
        },
      },
    ),
    section("purpose", "Why does it exist?", [
      "Currency markets help pay for trade. Stock markets help companies raise money. Commodity markets help move goods and share price risk. A wagering arrangement does none of these. It is a commercial service: a business offers participants a way to stake money on uncertain events, and earns revenue from doing so.",
      "Some people take part as entertainment, some for the excitement of uncertainty, and some in the belief that skill will reliably beat chance. The first two are motivations people give; the third is the belief that most needs checking. None of them is a reason to take part, and the harms described below are why caution matters. Laws about wagering differ widely between countries and change over time. This site makes no claim about what is permitted where you live.",
    ]),
    section(
      "participants",
      "Who is involved?",
      [
        "The cast is smaller than in financial markets, and the roles are different from those of buyers and sellers who trade with each other.",
      ],
      {
        points: [
          "Participants stake money on outcomes. They do not set the terms.",
          "Operators are businesses that write the rules, set the terms and settle outcomes. An operator is a commercial party, not a neutral referee.",
          "The athletes and teams in the event are not parties to the wager; their performance is simply what the outcome depends on.",
          "Regulators exist in some places, with different powers and approaches.",
          "Families and close associates are often affected, directly or indirectly, by the money and time involved.",
        ],
        sourceIds: ["phe-gambling-harms-review"],
      },
    ),
    section("mechanism", "How outcomes and terms work", [
      "In a financial market, a price emerges as many buyers and sellers trade with one another. In the common operator model of wagering, it is the operator that publishes the terms, and the participant agrees to them or does not take part. The result is then decided by the event itself, and the agreement is settled by the written rules.",
      "Operators are businesses, and their terms are designed so that they are expected to earn revenue over many participants and many events. That built-in advantage — the operator margin — is why, for participants as a group, winning consistently over time is hard. Some arrangements work differently — for example, participants may be matched with one another — but they remain agreements about outcomes, not ownership of an asset. This is a description of the structure, not a guide to any particular terms, and this site does not discuss specific terms, quotations or payout calculations.",
      "The Uncertainty Tiles lab makes a separate point using abstract coloured tiles with no connection to any sport, stake or payout: random results come in streaks, and short runs tell you very little.",
    ]),
    section("influences", "What shapes the result?", [
      "The result of a sporting event depends on things like the preparation and condition of those taking part, the conditions on the day, decisions made during play, and chance. Much of this can be widely known, and operators take it into account when setting their terms.",
      "That is why having information is not the same as removing uncertainty. Even a well-informed person cannot know in advance which way chance will fall, and a short run of results in either direction is normal. The mere fact that a result can be analysed does not make it predictable for any individual.",
    ]),
    section("narrative", "Reading a claim critically", [
      'Instead of a worked wager, here is a worked piece of media literacy. A fictional social-media post says: "My system never loses. Message me for access." The post is full of screenshots of wins. Run the five questions you would ask about any claim in any of the five systems.',
      'What is the object? The post never says what you would actually own or what you would be agreeing to. Who benefits if you take part? The seller of the "system" is paid for access whether or not it works. Where is the evidence? Screenshots show selected outcomes; no one posts the losses. What is being guaranteed? Nothing can be guaranteed when an outcome depends on chance. What would you do if it were wrong? A claim you cannot check is a claim you should not stake money on.',
      'The same five questions work on a forex "signal service", a stock "tip" or a crypto "guaranteed yield". If a claim has no answer to them, the mechanism does not matter: it is a warning sign. If you or someone you know is worried about the role gambling has taken in daily life, speak to someone you trust or a qualified local health or support service.',
    ]),
    section("misconceptions", "Common misconceptions", [
      'Most harmful ideas about wagering are about chance, skill and what "legal" means. These are the ones most worth correcting.',
    ]),
    section(
      "risks",
      "Risks and harms",
      [
        "An evidence review for England concluded that gambling can lead to a wide range of harms and classifies them by type. It also states clearly where the evidence is thin: most studies focus on the person who gambles, there is only some evidence on harms to close associates, and there is very limited evidence on wider societal harms.",
      ],
      {
        points: [
          "Financial harm: loss of money and effects on household finances.",
          "Relationship harm: disruption, conflict or breakdown in relationships.",
          "Mental and physical health harm.",
          "Cultural harm, employment and education harm, and criminal-activity harm are also classed as harm types in the review.",
          "Harms can reach families, close associates and communities, not only the individual.",
          "Some groups may be at greater risk, and gambling may make existing inequalities worse.",
          "Limits of the evidence: most studies cannot show that gambling came before the harm, so some findings show association rather than cause.",
        ],
        callout: {
          label: "Why this site exists",
          text: "The aim is to help people recognise the difference between systems — not to make any of them more appealing. There is nothing here to place, compare or practise.",
        },
        sourceIds: ["phe-gambling-harms-review"],
      },
    ),
    section("check", "Check your understanding", [
      "Five short questions with explanations after every answer. They test concepts only; there are no scenarios to wager on.",
    ]),
    section(
      "summary",
      "Summary and further reading",
      [
        "A wager is an agreement settled by an operator's rules, not an asset or an investment. The operator is a commercial party, outcomes depend partly on chance, and documented harms can reach beyond the individual to families and communities. Legal status is not a safety guarantee.",
      ],
      {
        points: [
          "A wager creates no ownership claim and ends at settlement.",
          "Operators earn revenue through the terms they set; information does not remove uncertainty.",
          'Streaks occur by chance, and nothing is ever "due".',
          "Harms are documented across finances, relationships and health, and can reach families.",
        ],
      },
    ),
  ],
  actors: [
    { name: "Participants", role: "Stake money on outcomes under terms they do not set." },
    {
      name: "Operators",
      role: "Commercial businesses that write the rules, set the terms and settle outcomes.",
    },
    {
      name: "Regulators",
      role: "Where they exist, set rules for the industry; approaches differ by country.",
    },
    {
      name: "Families and close associates",
      role: "Often affected by the money, time and stress involved.",
    },
  ],
  misconceptions: [
    {
      claim: "Betting is just another way of investing.",
      correction:
        "A wager creates no ownership stake in a company, currency or commodity; it is an agreement that ends at settlement, whereas a share continues to represent part of a business.",
      sourceIds: [],
    },
    {
      claim: "With enough skill or information, you can be sure to come out ahead.",
      correction:
        "Information does not remove uncertainty, and the operator's terms are designed so that, over many participants, it is expected to earn revenue.",
      sourceIds: [],
    },
    {
      claim: "After a run of bad results, a good one is due.",
      correction:
        "For independent chance events — a coin, a random draw — there is no memory, so a streak does not make the next result more likely to change. Believing otherwise is a thinking error.",
      sourceIds: [],
    },
    {
      claim: "If it is legal and regulated, it cannot do real harm.",
      correction:
        "Legal status is not a safety guarantee; gambling-related harms to finances, relationships and health are documented.",
      sourceIds: ["phe-gambling-harms-review"],
    },
    {
      claim: "Only the person who gambles is affected.",
      correction:
        "Harms can reach families, close associates and communities, although evidence on wider harms is limited.",
      sourceIds: ["phe-gambling-harms-review"],
    },
  ],
  glossaryTermIds: [
    "wager",
    "operator",
    "operator-margin",
    "probability",
    "variance",
    "uncertainty",
    "gambling-related-harm",
    "settlement",
  ],
  quizIds: [
    "sports-betting-q1",
    "sports-betting-q2",
    "sports-betting-q3",
    "sports-betting-q4",
    "sports-betting-q5",
  ],
  readingSourceIds: ["phe-gambling-harms-review"],
  labId: "uncertainty-tiles",
};
