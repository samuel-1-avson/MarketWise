import type { Lesson } from "@/lib/schemas";
import { REVIEWED, section } from "./helpers";

export const stocks: Lesson = {
  id: "stocks",
  title: "Stocks: owning a slice of a business",
  kicker: "Company ownership",
  summary:
    "A share is a fractional ownership interest in a company. It can rise, fall or become worthless, and it never guarantees a dividend.",
  snapshot: {
    changesHands: "A share — a fractional ownership stake in a company.",
    purpose: "Lets companies raise money and lets investors share in the business.",
    mainRisk: "Prices move down as well as up, and the whole stake can be lost.",
  },
  lastReviewed: REVIEWED,
  reviewNote:
    "What a stock is, why companies issue shares, the possibility of gains and dividends without any guarantee, price fluctuation, the ranking of common shareholders if a company fails, and the role of brokers and fees are drawn from the SEC's Investor.gov stocks page (a United States source). The description of how a market price forms where buyers and sellers meet, the roles of market makers and regulators, the definition of market capitalisation, and the bakery narrative (entirely fictional) are general explanation flagged for editorial verification. The page also cites a statistic about how often large-company stocks lose money; it is deliberately not repeated here. Nothing here describes Ghana's markets or rules.",
  sections: [
    section(
      "headline",
      "Stocks, in plain words",
      [
        "A stock — also called a share or an equity — is a unit of ownership in a company. If a bakery is divided into 1,000 equal shares and you own 10, you own one hundredth of the bakery: a small, real slice of the business.",
        "That slice is not a loan, a savings account or a promise. It is a claim on a share of whatever the business turns out to be worth, and it comes with the business's ups and downs. The SEC's investor-education page describes stocks as a type of security that gives stockholders a share of ownership in a company.",
      ],
      { usesIllustrativeNumbers: true, sourceIds: ["investor-gov-stocks"] },
    ),
    section(
      "object",
      "What actually changes hands?",
      [
        "When a share changes hands, an ownership interest moves from one person to another. The company itself usually carries on as before; what changes is who owns a portion of it.",
        "Two things are often confused with this. A share is not a guaranteed slice of future profits: a company may earn little, or choose to reinvest instead of paying anything out. And owning shares is not the same as owning the company's buildings or products; you own a fractional interest in the company, which in turn owns those things.",
      ],
      {
        callout: {
          label: "Ownership, not a guarantee",
          text: "A share is a claim to a fraction of a business — not a guaranteed return, not a loan, and not the same as owning its assets directly.",
        },
        sourceIds: ["investor-gov-stocks"],
      },
    ),
    section(
      "purpose",
      "Why does the stock market exist?",
      [
        "Companies need money to grow. According to the SEC, companies issue stock to raise funds for purposes that may include paying off debt, launching new products, expanding into new markets and building or enlarging facilities.",
        "In return, the people who supply that money become part-owners. They may benefit if the company does well, through the share price rising or through dividends, and they may have voting rights at shareholder meetings. They also share the risk of the company doing badly. A market where shares can be bought and sold afterwards makes it easier for investors to supply money in the first place.",
      ],
      { sourceIds: ["investor-gov-stocks"] },
    ),
    section(
      "participants",
      "Who takes part, and why?",
      [
        "Many different parties interact around a share, each with different aims. The company wants funding; the owners want a return on a business they believe in; intermediaries earn fees for making trading possible.",
      ],
      {
        points: [
          "Issuers (companies) create shares to raise money.",
          "Investors buy shares hoping for price rises or dividends, and accept the risk of loss.",
          "Brokers carry out purchases and sales for clients and charge fees.",
          "Exchanges are organised marketplaces with rules for how shares trade.",
          "Market makers help ensure there is someone to trade with, earning from the spread.",
          "Regulators set disclosure and conduct rules, though they cannot protect investors from price falls.",
        ],
        sourceIds: ["investor-gov-stocks"],
      },
    ),
    section(
      "mechanism",
      "How a share price is set",
      [
        "On an exchange, a share's price is the level at which buyers and sellers are currently willing to trade. If more people want to buy than sell at a given price, it tends to rise; if more want to sell, it tends to fall. No one fixes it in advance.",
        "That means the price is not a fact about the company, but a running summary of many people's opinions about it. Two investors can look at the same company and honestly disagree about what it is worth, which is why a price can change even when nothing about the business has changed.",
        "Market capitalisation is the price multiplied by the number of shares. In our fictional bakery, if each of the 1,000 shares currently trades at 50 cedis, the market values the whole business at 50,000 cedis. That is the market's current price tag, not cash in the company's account.",
      ],
      { usesIllustrativeNumbers: true, sourceIds: ["investor-gov-stocks"] },
    ),
    section(
      "influences",
      "What influences share prices?",
      [
        "The SEC notes that a stock's price can be affected by factors inside the company, such as a faulty product, and by events the company has no control over, such as political or market events. In practice several kinds of information feed in.",
      ],
      {
        points: [
          "Earnings and expectations: results, and whether they beat or miss what investors expected.",
          "Company news: new products, management changes, legal problems.",
          "Interest rates and the wider economy, which change the appeal of owning businesses.",
          "Industry and competition.",
          "Market mood: fear and optimism can move prices beyond what the news alone would suggest.",
        ],
        callout: {
          label: "Prices are expectations",
          text: 'A share price reflects what investors expect about the future, not just what has happened. That is why good news can be "already in the price".',
        },
        sourceIds: ["investor-gov-stocks"],
      },
    ),
    section(
      "narrative",
      "A fictional bakery",
      [
        "Sunrise Bakery Ltd is a fictional company with 1,000 shares. Ama owns 25 of them: 25 ÷ 1,000 means she owns 2.5% of the business. The bakery's owners decide whether to pay out any of the profits.",
        "In a good year the bakery earns more than it spends and the directors choose to pay a small dividend per share, so Ama receives a payment in proportion to her 25 shares. In a poor year they choose to pay nothing and keep the money in the business. Neither decision is guaranteed by the share she holds.",
        "If a new bakery opens next door and customers drift away, other investors may expect lower profits, and buyers for Sunrise shares may only be willing to pay less. Ama's stake is still 2.5%; what changed is what the market thinks 2.5% is worth. If the bakery failed completely, shareholders are paid after the people the bakery owes money to — and Ama may receive nothing.",
      ],
      { usesIllustrativeNumbers: true, sourceIds: ["investor-gov-stocks"] },
    ),
    section("misconceptions", "Common misconceptions", [
      "Shares are often described in tidy slogans. Each of these slogans leaves something important out.",
    ]),
    section(
      "risks",
      "Risks and failure modes",
      [
        "The SEC is clear that there is no guarantee a company whose stock you hold will grow and do well, so you can lose money you invest in stocks.",
      ],
      {
        points: [
          "Price risk: prices move down as well as up, sometimes sharply.",
          "Loss of the whole stake: if a company fails, common shareholders are last in line after creditors and preferred shareholders, and what is left may be nothing.",
          "Selling at a bad time: if you have to sell on a day when the price is below what you paid, you lose money on the sale.",
          "Concentration: holding just one or two companies exposes you to their individual failures; spreading holdings can offset some risk but not eliminate it.",
          "Costs: broker commissions, spreads and other fees apply however the share performs.",
          "Fraud: the SEC lists avoiding fraud as a core topic; extraordinary promises of returns are a warning sign.",
        ],
        sourceIds: ["investor-gov-stocks"],
      },
    ),
    section("check", "Check your understanding", [
      "Five short questions with explanations after every answer. Retry as often as you like.",
    ]),
    section(
      "summary",
      "Summary and further reading",
      [
        "A share is a fractional ownership interest in a company. It may rise, fall or fall to nothing; dividends are possible but not promised; and common shareholders are paid last if a business fails. A price is a running summary of many people's expectations, not a fixed fact.",
      ],
      {
        points: [
          "A share is ownership of a fraction of a company, not a loan and not a guaranteed profit share.",
          "Companies issue shares to raise money; investors accept risk in return for possible gains.",
          "Prices reflect changing expectations and can fall as well as rise.",
          "Owning a share can mean losing the whole amount invested.",
        ],
      },
    ),
  ],
  actors: [
    { name: "Companies (issuers)", role: "Create shares to raise money for the business." },
    {
      name: "Investors",
      role: "Buy shares hoping to gain from price rises or dividends, accepting the risk of loss.",
    },
    { name: "Brokers", role: "Carry out purchases and sales for clients, charging fees." },
    { name: "Exchanges", role: "Operate organised marketplaces with rules for trading." },
    {
      name: "Regulators",
      role: "Set disclosure and conduct rules; they cannot prevent price falls.",
    },
  ],
  misconceptions: [
    {
      claim: "Owning a share guarantees growth or a dividend.",
      correction:
        "Prices move down as well as up and dividends are the company's choice. Nothing about owning a share promises either.",
      sourceIds: ["investor-gov-stocks"],
    },
    {
      claim: "A share price tells you exactly what a company is worth.",
      correction:
        "A price is the market's current opinion and changes as expectations change. Different people value the same company differently.",
      sourceIds: [],
    },
    {
      claim: "If a company fails, shareholders at least get their money back.",
      correction:
        "Common shareholders are paid last, after creditors and preferred shareholders, and may receive nothing.",
      sourceIds: ["investor-gov-stocks"],
    },
    {
      claim: "Because the company is real and well-known, the share is safe.",
      correction:
        "Even companies that are not failing see their share prices fluctuate, and shareholders carry business risk.",
      sourceIds: ["investor-gov-stocks"],
    },
  ],
  glossaryTermIds: [
    "share",
    "equity",
    "shareholder",
    "dividend",
    "issuer",
    "exchange",
    "broker",
    "earnings",
    "valuation",
    "market-capitalisation",
    "diversification",
  ],
  quizIds: ["stocks-q1", "stocks-q2", "stocks-q3", "stocks-q4", "stocks-q5"],
  readingSourceIds: ["investor-gov-stocks"],
  labId: "ownership-lens",
};
