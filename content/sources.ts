import type { Source } from "@/lib/schemas";

/**
 * Source registry. A source is `verified` only after its page was actually opened and read and
 * found to support the claims it is cited for; `reviewedOn` is that date. These starting
 * references come from PRODUCT_AND_BUILD_SPEC.md §14 and are regulator/consumer-education pages
 * from the United States and Australia — they are not statements about Ghanaian law.
 *
 * Sports-betting harm-awareness: the WHO gambling fact sheet was NOT added — its page body did not
 * render in the review browser, so it could not be read. Add further sources only after a page has
 * actually been opened and read.
 */
export const sources: readonly Source[] = [
  {
    id: "cftc-forex-advisory",
    title: "Customer Advisory: Eight Things You Should Know Before Trading Forex",
    url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CustomerAdvisory_MustKnowForex.html",
    publisher: "U.S. Commodity Futures Trading Commission (CFTC)",
    supports:
      "In retail off-exchange forex you trade against your dealer, who is your counterparty and earns from spreads, fees and commissions; margin lets a small deposit control a much larger position, amplifying gains and losses, and you may owe more than your deposit; deposits may not be protected if a dealer fails; checking registration is recommended but registration alone does not prevent fraud.",
    pageDate: "No date shown on the page; its loss statistics cite Q2 2021 to Q1 2022.",
    reviewedOn: "2026-10-30",
    status: "verified",
    caveat:
      "United States context (CFTC/NFA registration, U.S. leverage limits). Undated and its statistics are from 2021–2022 — do not quote them as current. Not a statement about Ghana.",
  },
  {
    id: "moneysmart-forex",
    title: "Forex trading",
    url: "https://moneysmart.gov.au/complex-investment-products/forex-trading",
    publisher: "ASIC Moneysmart (Australian Securities and Investments Commission)",
    supports:
      "A currency pair shows the value of one currency in another (e.g. AUD/USD); exchange rates reflect demand and supply and move with interest rates, economic and trade conditions; margin FX is generally regulated in Australia as a type of contract for difference (CFD) that lets people speculate on exchange rates without owning the underlying currency; leverage magnifies gains and losses, and a provider may require more money at short notice or close a position; most retail investors find it difficult to make money from leveraged forex trading over the long term; spreads, commissions and financing costs add up, and frequent trading can reduce profits and increase losses; lack of liquidity, execution risk or system problems can delay trades; scammers may use fake platforms and promises of easy profits; if a provider becomes insolvent you may not get your money back; even the most experienced traders have difficulty predicting movements, and claims that a course, signal service, copy-trading service, program or AI tool can accurately predict currency movements deserve wariness.",
    pageDate: "Last updated: 10 September 2026",
    reviewedOn: "2026-10-30",
    status: "verified",
    caveat:
      "Australian regulatory context (ASIC, AFS licences, AFCA). Use for the general mechanism and risks only; do not imply those rules apply in Ghana.",
  },
  {
    id: "investor-gov-stocks",
    title: "Stocks - FAQs",
    url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks",
    publisher:
      "U.S. Securities and Exchange Commission (SEC), Office of Investor Education and Advocacy — Investor.gov",
    supports:
      "A stock is a security giving a share of ownership in a company; companies issue stock to raise money (for example to pay off debt, launch products, expand or build facilities); investors may gain from price rises, dividends and voting rights, none guaranteed; prices move down as well as up and money can be lost; a stock's price can be affected by factors inside the company (such as a faulty product) and by events outside its control (such as political or market events); common stockholders are paid last if a company fails, possibly receiving nothing; shares are bought and sold through brokers, direct stock plans, dividend reinvestment plans or funds, and fees apply; holding several stocks can offset some risk; the page has a section on avoiding fraud.",
    pageDate: "No date shown in the page text.",
    reviewedOn: "2026-10-30",
    status: "verified",
    caveat: "United States context. Use for the general nature of equity and its risks.",
  },
  {
    id: "cftc-futures-basics",
    title: "Futures Market Basics",
    url: "https://www.cftc.gov/LearnAndProtect/EducationCenter/FuturesMarketBasics/index2.htm",
    publisher: "U.S. Commodity Futures Trading Commission (CFTC)",
    supports:
      "A commodity futures contract is an agreement to buy or sell a commodity at a future date with price and quantity fixed when the agreement is made; most contracts are closed out before delivery and some settle in cash; participants include hedgers (producers or consumers managing price risk) and speculators; futures and options trading is described as volatile, complex and risky, and many people lose all their money and may be required to pay more than they invested; futures must generally be traded on an exchange through CFTC-registered firms, with customer funds kept separate from the firm's own.",
    pageDate: "No date shown on the page.",
    reviewedOn: "2026-10-30",
    status: "verified",
    caveat:
      "United States context. Undated page on an older-style URL that may be reorganised; re-check the link before each release.",
  },
  {
    id: "investor-gov-commodities",
    title: "Commodities",
    url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/commodities",
    publisher:
      "U.S. Securities and Exchange Commission (SEC), Office of Investor Education and Advocacy — Investor.gov",
    supports:
      "Exchange-traded commodity futures have a set unit size, fixed expiration date and centralised clearing, in which a clearing corporation acts as the single counterparty to every transaction and guarantees its completion and creditworthiness; metals, grains, other foods and financial instruments (including currencies) are traded in the futures market; the CFTC cautions investors to be wary of offers of high-yield opportunities in futures, options or forex, which are common areas of fraud.",
    pageDate: "No date shown in the page text.",
    reviewedOn: "2026-10-30",
    status: "verified",
    caveat:
      "United States regulatory framing (SEC does not regulate commodity futures; the CFTC does). The page is about futures, not about owning physical goods.",
  },
  {
    id: "investor-gov-crypto-related",
    title: "Crypto Asset-Related Investments",
    url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/crypto-asset-related-investments",
    publisher:
      "U.S. Securities and Exchange Commission (SEC), Office of Investor Education and Assistance — Investor.gov",
    supports:
      "A crypto asset is a digital representation of value recorded on a cryptographically secured distributed ledger; crypto asset-related investments offer opportunities and risks and can be volatile and lose money; holders access crypto assets through a digital wallet using private keys or passcodes, and choose self-custody or third-party custody, each with its own risks; owning shares of a publicly listed crypto-related company means owning part of the company, not the crypto assets, and its shares may trade higher or lower independent of any crypto price; funds and exchange-traded products give indirect exposure.",
    pageDate: "No date shown in the page text.",
    reviewedOn: "2026-10-30",
    status: "verified",
    caveat:
      "United States context; a description of how the SEC frames these products, not a global legal definition.",
  },
  {
    id: "investor-gov-crypto-securities-alert",
    title: "Exercise Caution with Crypto Asset Securities: Investor Alert",
    url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/crypto-asset-securities",
    publisher:
      "U.S. Securities and Exchange Commission (SEC), Office of Investor Education and Advocacy — Investor.gov",
    supports:
      "Investments in crypto asset securities can be exceptionally volatile and speculative, and the platforms where they are bought, sold, borrowed or lent may lack important investor protections; the risk of loss for individual investors in crypto asset transactions remains significant; those offering crypto asset investments or services may not be complying with applicable law, and unregistered offerings may not give key information; only money one can afford to lose entirely should be put at risk in a speculative investment; 'proof of reserves' is a point-in-time snapshot that may not show liabilities, has no specific audit requirements and is not as rigorous as an audit.",
    pageDate: "March 23, 2023",
    reviewedOn: "2026-10-30",
    status: "verified",
    caveat:
      "Dated March 2023 and written for U.S. securities law. Treat as a risk illustration, and check whether newer guidance exists before quoting specifics.",
  },
  {
    id: "phe-gambling-harms-review",
    title: "Gambling-related harms evidence review: summary",
    url: "https://www.gov.uk/government/publications/gambling-related-harms-evidence-review/gambling-related-harms-evidence-review-summary--2",
    publisher:
      "Office for Health Improvement & Disparities (formerly Public Health England), GOV.UK",
    supports:
      "Gambling-related harms are wide-ranging and are classed by type (financial; relationship disruption, conflict or breakdown; mental and physical health; cultural; employment and education; criminal activity); harms are described as reaching the individual, their families, close associates, communities and wider society, though evidence on harms beyond the person gambling is limited; some groups (for example migrants and people with learning disabilities, per some qualitative evidence) may be at greater risk and gambling may make existing inequalities worse; most stakeholders other than commercial ones consider gambling a public health issue; the review states the limits of the evidence (for example, most studies cannot show that gambling came before the harm).",
    pageDate: "Updated 11 January 2023",
    reviewedOn: "2026-10-30",
    status: "verified",
    caveat:
      "Applies to England and reflects data up to about 2018–2020. It is a health-harm evidence review; it says nothing about Ghana and is not a description of any particular operator or product.",
  },
];

export const sourceById = new Map(sources.map((s) => [s.id, s] as const));
