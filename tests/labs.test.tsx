import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FxQuoteLab } from "@/components/labs/FxQuoteLab";
import { LedgerLab } from "@/components/labs/LedgerLab";
import { LeverageLab } from "@/components/labs/LeverageLab";
import { OwnershipLab } from "@/components/labs/OwnershipLab";
import { SupplyLab } from "@/components/labs/SupplyLab";
import { UncertaintyLab } from "@/components/labs/UncertaintyLab";
import { labComponents } from "@/components/labs/registry";
import { labs } from "@/content/labs";
import { ILLUSTRATIVE_LABEL } from "@/lib/constants";

const live = () => screen.getByTestId("lab-live");

describe("lab registry", () => {
  it("has exactly one component for each lab in the content", () => {
    expect(Object.keys(labComponents).sort()).toEqual(labs.map((l) => l.id).sort());
  });

  it.each(labs.map((l) => [l.id, l] as const))(
    "%s shows the fiction label, controls, plain-words text and its limits",
    (id, lab) => {
      const Lab = labComponents[id];
      if (!Lab) throw new Error(`missing component for ${id}`);
      render(<Lab />);
      expect(screen.getByText(ILLUSTRATIVE_LABEL)).toBeInTheDocument();
      expect(screen.getByRole("group", { name: `${lab.title} controls` })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "In plain words" })).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "What this lab does not do" }),
      ).toBeInTheDocument();
      expect(screen.getByText(lab.limits)).toBeInTheDocument();
      expect(live().textContent?.length ?? 0).toBeGreaterThan(40);
      expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    },
  );
});

describe("FX Quote Explainer", () => {
  it("starts at the invented 10.00 quote, steps through the series and compares with the last quote viewed", async () => {
    const user = userEvent.setup();
    render(<FxQuoteLab />);
    expect(live()).toHaveTextContent(
      "1 US dollar is worth 10.00 Ghana cedis in this invented example.",
    );

    await user.click(screen.getByRole("button", { name: /Next quote/ }));
    expect(live()).toHaveTextContent("The number rose from 10.00 to 10.50");
    expect(live()).toHaveTextContent("weakened");

    await user.click(screen.getByRole("button", { name: /Previous quote/ }));
    await user.click(screen.getByRole("button", { name: /Previous quote/ }));
    expect(live()).toHaveTextContent("The number fell from 10.00 to 9.50");
    expect(live()).toHaveTextContent("strengthened");
  });

  it("disables the buttons at either end of the series", async () => {
    const user = userEvent.setup();
    render(<FxQuoteLab />);
    const earlier = screen.getByRole("button", { name: /Previous quote/ });
    const later = screen.getByRole("button", { name: /Next quote/ });
    await user.click(earlier);
    await user.click(earlier);
    expect(earlier).toBeDisabled();
    await user.click(later);
    await user.click(later);
    await user.click(later);
    await user.click(later);
    expect(later).toBeDisabled();
    expect(live()).toHaveTextContent("11.00");
  });

  it("flips to GHS/USD and reads the same quote from the other side", async () => {
    const user = userEvent.setup();
    render(<FxQuoteLab />);
    await user.click(screen.getByRole("radio", { name: /GHS\/USD/ }));
    expect(live()).toHaveTextContent("1 Ghana cedi is worth 0.1000 US dollars");
    expect(screen.getByRole("img", { name: /GHS\/USD 0\.1000/ })).toBeInTheDocument();
  });

  it("is operable from the keyboard slider and resets", async () => {
    const user = userEvent.setup();
    render(<FxQuoteLab />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuetext", "Quote 3 of 5, USD/GHS 10.00");
    fireEvent.change(slider, { target: { value: "5" } });
    expect(slider).toHaveAttribute("aria-valuetext", "Quote 5 of 5, USD/GHS 11.00");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(slider).toHaveAttribute("aria-valuetext", "Quote 3 of 5, USD/GHS 10.00");
  });

  it("has no amount or rate input, so it cannot be a converter", () => {
    render(<FxQuoteLab />);
    expect(document.querySelectorAll("input[type=number], input[type=text]")).toHaveLength(0);
  });
});

describe("Leverage Sensitivity Bands", () => {
  it("widens the bands as the abstract level rises and says the deposit is used up", async () => {
    const user = userEvent.setup();
    render(<LeverageLab />);
    expect(live()).toHaveTextContent(
      "With no leverage, a 1% move changes your own money by about 1%",
    );

    await user.click(screen.getByRole("radio", { name: "More" }));
    expect(live()).toHaveTextContent("20× sensitivity");
    expect(live()).toHaveTextContent("uses up all of the money put in");
    expect(screen.getByText("All of it (100%)")).toBeInTheDocument();
    expect(
      screen.getByText("All the money put in is used up in this toy model"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Some" }));
    expect(
      screen.queryByText("All the money put in is used up in this toy model"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("25%")).toHaveLength(2); // against and in favour, symmetrical
  });

  it("shows gains and losses symmetrically in an accessible table, with the caveat", () => {
    render(<LeverageLab />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(5);
    expect(screen.getByText(/Nothing here says what anyone should choose/)).toBeInTheDocument();
  });

  it("resets to no leverage and has no money or size input", async () => {
    const user = userEvent.setup();
    render(<LeverageLab />);
    await user.click(screen.getByRole("radio", { name: "More" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("radio", { name: "None" })).toBeChecked();
    expect(
      document.querySelectorAll("input[type=number], input[type=text], input[type=range]"),
    ).toHaveLength(0);
  });
});

describe("Equity Ownership Lens", () => {
  it("shows 25 of 1,000 shares as 2.5% and a mosaic description", () => {
    render(<OwnershipLab />);
    expect(live()).toHaveTextContent("25 of 1,000 shares is 2.5% of the fictional company");
    expect(screen.getByRole("img", { name: /25 are highlighted: 2\.5%/ })).toBeInTheDocument();
  });

  it("follows the number box and clamps nonsense", () => {
    render(<OwnershipLab />);
    const box = screen.getByLabelText(/Or type a number/);
    fireEvent.change(box, { target: { value: "100" } });
    expect(live()).toHaveTextContent("100 of 1,000 shares is 10%");
    fireEvent.change(box, { target: { value: "5000" } });
    expect(live()).toHaveTextContent("1,000 of 1,000 shares is 100%");
    fireEvent.change(box, { target: { value: "-40" } });
    expect(live()).toHaveTextContent("own none");
    fireEvent.change(box, { target: { value: "" } });
    expect(live()).toHaveTextContent("own none");
    expect(live().textContent).not.toMatch(/NaN|undefined/);
  });

  it("follows the slider and the quick picks", async () => {
    const user = userEvent.setup();
    render(<OwnershipLab />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "500" } });
    expect(live()).toHaveTextContent("500 of 1,000 shares is 50%");
    await user.click(screen.getByRole("button", { name: "1 shares" }));
    expect(live()).toHaveTextContent("1 of 1,000 shares is 0.1%");
  });

  it("shows that a dividend is a decision, not a guarantee", async () => {
    const user = userEvent.setup();
    render(<OwnershipLab />);
    expect(live()).toHaveTextContent("Owning shares does not guarantee a dividend");
    fireEvent.change(screen.getByLabelText(/Or type a number/), { target: { value: "100" } });
    await user.click(screen.getByRole("radio", { name: /pays a fictional pool/ }));
    expect(live()).toHaveTextContent("500 cedis");
    expect(live()).toHaveTextContent("not a promise");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(live()).toHaveTextContent("25 of 1,000 shares is 2.5%");
    expect(screen.getByRole("radio", { name: /pays no dividend/ })).toBeChecked();
  });
});

describe("Commodity Supply Story", () => {
  it("starts in a normal season with no price pressure", () => {
    render(<SupplyLab />);
    expect(live()).toHaveTextContent("Nothing has changed");
    expect(screen.getAllByText("● No change", { selector: "dd" })).toHaveLength(2); // price and quantity
  });

  it("moves the supply line left and shows higher price pressure and lower quantity", async () => {
    const user = userEvent.setup();
    render(<SupplyLab />);
    await user.click(screen.getByRole("radio", { name: /drought/ }));
    expect(live()).toHaveTextContent("the supply line moves left");
    expect(live()).toHaveTextContent("higher price and a lower quantity");
    expect(screen.getByText("▲ Upward pressure in this model")).toBeInTheDocument();
    expect(screen.getByText("▼ Lower in this model")).toBeInTheDocument();
    expect(screen.getByText(/Supply \(moved left\)/)).toBeInTheDocument();
    expect(screen.getAllByText(/not a forecast/).length).toBeGreaterThan(0);
  });

  it("offers four scenarios and resets", async () => {
    const user = userEvent.setup();
    render(<SupplyLab />);
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    await user.click(screen.getByRole("radio", { name: /Both at once/ }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("radio", { name: "Normal season" })).toBeChecked();
    expect(screen.queryByText(/Supply \(moved left\)/)).not.toBeInTheDocument();
  });
});

describe("Ledger Journey", () => {
  const nextStep = () => screen.getByRole("button", { name: /Next step/ });

  it("steps through a valid request and records a new entry", async () => {
    const user = userEvent.setup();
    render(<LedgerLab />);
    expect(screen.getByRole("button", { name: /Back/ })).toBeDisabled();
    expect(screen.getByText(/Step 1 of 4: Request/)).toBeInTheDocument();
    expect(
      screen.getAllByRole("listitem").filter((li) => li.getAttribute("aria-current") === "step"),
    ).toHaveLength(1);

    await user.click(nextStep());
    expect(screen.getByText(/Step 2 of 4: Broadcast/)).toBeInTheDocument();
    await user.click(nextStep());
    expect(screen.getByText(/Step 3 of 4: Validation/)).toBeInTheDocument();
    expect(live()).toHaveTextContent("Every check passes");
    await user.click(nextStep());
    expect(screen.getByText(/Step 4 of 4: Ledger update/)).toBeInTheDocument();
    expect(screen.getByText("✓ New entry")).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Ledger entries" })).getAllByRole("listitem"),
    ).toHaveLength(3);
    expect(screen.queryByRole("button", { name: /Next step/ })).not.toBeInTheDocument();
  });

  it("replays from the start and can go back", async () => {
    const user = userEvent.setup();
    render(<LedgerLab />);
    await user.click(nextStep());
    await user.click(screen.getByRole("button", { name: /Back/ }));
    expect(screen.getByText(/Step 1 of 4:/, { selector: "h2" })).toBeInTheDocument();
    for (let i = 0; i < 3; i += 1) await user.click(nextStep());
    await user.click(screen.getByRole("button", { name: /Replay/ }));
    expect(screen.getByText(/Step 1 of 4:/, { selector: "h2" })).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Ledger entries" })).getAllByRole("listitem"),
    ).toHaveLength(2);
  });

  it("rejects a request that breaks a rule and leaves the ledger unchanged", async () => {
    const user = userEvent.setup();
    render(<LedgerLab />);
    await user.click(screen.getByRole("radio", { name: /breaks a rule/ }));
    for (let i = 0; i < 3; i += 1) await user.click(nextStep());
    expect(screen.getByText(/Request rejected — the ledger has not changed/)).toBeInTheDocument();
    expect(live()).toHaveTextContent("token A is still controlled by Ama");
    expect(
      within(screen.getByRole("list", { name: "Ledger entries" })).getAllByRole("listitem"),
    ).toHaveLength(2);
  });

  it("returns to step 1 when the request type changes or on reset", async () => {
    const user = userEvent.setup();
    render(<LedgerLab />);
    await user.click(nextStep());
    await user.click(screen.getByRole("radio", { name: /breaks a rule/ }));
    expect(screen.getByText(/Step 1 of 4:/, { selector: "h2" })).toBeInTheDocument();
    await user.click(nextStep());
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("radio", { name: "A valid request" })).toBeChecked();
    expect(screen.getByText(/Step 1 of 4:/, { selector: "h2" })).toBeInTheDocument();
  });
});

describe("Uncertainty Tiles", () => {
  it("reveals tiles one at a time and reports counts and runs in text", async () => {
    const user = userEvent.setup();
    render(<UncertaintyLab />);
    expect(live()).toHaveTextContent("No tiles revealed yet");
    await user.click(screen.getByRole("button", { name: "Reveal next" }));
    await user.click(screen.getByRole("button", { name: "Reveal next" }));
    await user.click(screen.getByRole("button", { name: "Reveal next" }));
    expect(live()).toHaveTextContent(/Revealed 3 of 60 tiles/);
    await user.click(screen.getByRole("button", { name: "Reveal 10 more" }));
    expect(live()).toHaveTextContent(/Revealed 13 of 60 tiles/);
  });

  it("reveals everything, shows blocks of ten that differ, then stops offering more", async () => {
    const user = userEvent.setup();
    render(<UncertaintyLab />);
    await user.click(screen.getByRole("button", { name: "Reveal all" }));
    expect(live()).toHaveTextContent("Revealed 60 of 60 tiles");
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(1 + 6); // header (screen-reader only) + six blocks
    expect(screen.getByRole("button", { name: "Reveal next" })).toBeDisabled();
    expect(live().textContent).toMatch(
      /Longest streak so far: [4-9]|[1-9]\d circles?|Longest streak so far: \d+ (circle|square)s? in a row/,
    );
  });

  it("is deterministic: the same fixed run gives the same tiles after a reset", async () => {
    const user = userEvent.setup();
    render(<UncertaintyLab />);
    const reveal = async () => {
      await user.click(screen.getByRole("button", { name: "Reveal 10 more" }));
      await user.click(screen.getByText(/Sequence as text/));
      return screen.getByTestId("tile-sequence").textContent;
    };
    const first = await reveal();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    const second = await reveal();
    expect(first).toBe(second);
    expect(first?.split(" ")).toHaveLength(10);
  });

  it("starts fresh when the mix or the run changes", async () => {
    const user = userEvent.setup();
    render(<UncertaintyLab />);
    await user.click(screen.getByRole("button", { name: "Reveal 10 more" }));
    await user.click(screen.getByRole("radio", { name: "Uneven mix" }));
    expect(live()).toHaveTextContent("No tiles revealed yet");
    await user.click(screen.getByRole("button", { name: "Reveal 10 more" }));
    await user.click(screen.getByRole("radio", { name: "Set 3" }));
    expect(live()).toHaveTextContent("No tiles revealed yet");
  });
});

describe("safety boundaries across all labs", () => {
  const rendered = labs.map((lab) => {
    const Lab = labComponents[lab.id];
    if (!Lab) throw new Error(lab.id);
    const { container, unmount } = render(<Lab />);
    const text = container.textContent ?? "";
    const inputs = [...container.querySelectorAll("input")].map((i) => i.type);
    unmount();
    return { id: lab.id, text, inputs };
  });

  it("offers no trading, ordering, wallet or promotional vocabulary", () => {
    for (const { id, text } of rendered) {
      expect(text, id).not.toMatch(
        /buy now|sell now|place (an? )?order|start trading|connect (a |your )?wallet|seed phrase|private key|promo|bonus|sign up/i,
      );
    }
  });

  it("mentions odds, payouts, wagers or stakes only to say they are excluded", () => {
    for (const { id, text } of rendered) {
      const sentences = text.split(/(?<=[.!?])\s+/);
      for (const s of sentences.filter((x) => /\b(odds|payouts?|wagers?|stakes?)\b/i.test(x))) {
        expect(s, `${id}: ${s}`).toMatch(/\b(not|no|nothing|never|without)\b/i);
      }
    }
  });

  it("collects no free text: the only number input is the share count in the ownership lab", () => {
    for (const { id, inputs } of rendered) {
      expect(inputs.includes("text"), id).toBe(false);
      expect(inputs.includes("number"), id).toBe(id === "ownership-lens");
    }
  });

  it("never shows NaN, undefined or placeholder text in any initial state", () => {
    for (const { id, text } of rendered) {
      // Word-bounded and case-sensitive so ordinary words such as "financing" never trip it.
      expect(text, id).not.toMatch(/\bNaN\b|\bundefined\b|\[object|lorem ipsum|\bTODO\b/);
    }
  });
});
