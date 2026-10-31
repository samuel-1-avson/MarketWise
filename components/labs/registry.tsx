import type { ComponentType } from "react";
import { FxQuoteLab } from "@/components/labs/FxQuoteLab";
import { LedgerLab } from "@/components/labs/LedgerLab";
import { LeverageLab } from "@/components/labs/LeverageLab";
import { OwnershipLab } from "@/components/labs/OwnershipLab";
import { SupplyLab } from "@/components/labs/SupplyLab";
import { UncertaintyLab } from "@/components/labs/UncertaintyLab";

/** Maps each lab id in content/labs.ts to its interactive component. Kept in step by a test. */
export const labComponents: Readonly<Record<string, ComponentType>> = {
  "fx-quote": FxQuoteLab,
  "leverage-sensitivity": LeverageLab,
  "ownership-lens": OwnershipLab,
  "supply-shock": SupplyLab,
  "ledger-journey": LedgerLab,
  "uncertainty-tiles": UncertaintyLab,
};
