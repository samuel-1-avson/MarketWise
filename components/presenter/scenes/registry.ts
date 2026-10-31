import type { ComponentType } from "react";
import {
  CryptoRisks,
  FourObjects,
  LedgerNetwork,
  OutcomeBranch,
  SpeculationSpectrum,
} from "./cryptoAndComparison";
import {
  CurrencyPlates,
  FiveDisciplines,
  ImporterBankExporter,
  LeverageBars,
  MarketActors,
  OrbitQuestion,
  RateDrivers,
  UncertaintyField,
} from "./hookAndForex";
import {
  CompanyShares,
  PriceDriversMosaic,
  SpotVsFutures,
  SupplyChain,
  SupplyCurve,
} from "./stocksAndCommodities";
import {
  AudienceQuestions,
  FiveTakeaways,
  FrictionCards,
  KeepLearning,
  RedactedClaims,
  RiskColumns,
} from "./synthesis";

/** Maps each slide's `visual` id to the scene that draws it. Kept in step with the content by a test. */
export const sceneComponents: Readonly<Record<string, ComponentType>> = {
  "orbit-question": OrbitQuestion,
  "five-disciplines": FiveDisciplines,
  "market-actors": MarketActors,
  "uncertainty-field": UncertaintyField,
  "currency-plates": CurrencyPlates,
  "importer-bank-exporter": ImporterBankExporter,
  "rate-drivers": RateDrivers,
  "leverage-bars": LeverageBars,
  "company-shares": CompanyShares,
  "price-drivers-mosaic": PriceDriversMosaic,
  "supply-chain": SupplyChain,
  "spot-vs-futures": SpotVsFutures,
  "supply-curve": SupplyCurve,
  "ledger-network": LedgerNetwork,
  "crypto-risks": CryptoRisks,
  "outcome-branch": OutcomeBranch,
  "four-objects": FourObjects,
  "speculation-spectrum": SpeculationSpectrum,
  "redacted-claims": RedactedClaims,
  "friction-cards": FrictionCards,
  "risk-columns": RiskColumns,
  "audience-questions": AudienceQuestions,
  "five-takeaways": FiveTakeaways,
  "keep-learning": KeepLearning,
};
